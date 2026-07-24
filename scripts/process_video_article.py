#!/usr/bin/env python3
"""
===============================================================================
Skript pro automatické zpracování edukačních/osvětových videí pro "Táta má právo"
===============================================================================
Workflow:
1. Stažení audio stopy z videa (YouTube, Facebook, atd.) pomocí yt-dlp.
2. Nahraní audia přes Google GenAI SDK (google-genai) do Gemini API.
3. Generování odborného článku v češtině (přepis + právně-psychologická analýza).
4. Automatické publikování článku jako Markdown souboru do GitHub repozitáře přes GitHub REST API.
5. Úklid dočasných souborů.

Požadavky na závislosti:
    pip install google-genai yt-dlp requests python-slugify

Požadované proměnné prostředí (Environment Variables):
    GEMINI_API_KEY  - API klíč pro Google Gemini API
    GITHUB_TOKEN    - Personal Access Token pro GitHub s právy k zápisu (repo contents)
    GITHUB_REPO     - Název repozitáře např. "owner/tata-ma-pravo"
    GITHUB_BRANCH   - Cílová větev (výchozí: "main")
===============================================================================
"""

import os
import sys
import tempfile
import time
import datetime
import base64
import logging
from pathlib import Path
import requests
from slugify import slugify

# Import oficiálního Google GenAI SDK
try:
    from google import genai
    from google.genai import types
except ImportError:
    print("❌ Chyba: Balíček 'google-genai' není nainstalován. Nainstalujte ho pomocí: pip install google-genai")
    sys.exit(1)

# Import yt-dlp
try:
    import yt_dlp
except ImportError:
    print("❌ Chyba: Balíček 'yt-dlp' není nainstalován. Nainstalujte ho pomocí: pip install yt-dlp")
    sys.exit(1)


# Nastavení logování
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("VideoProcessor")


# Konfigurace z proměnných prostředí nebo výchozích hodnot
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO = os.getenv("GITHUB_REPO", "owner/tata-ma-pravo")
GITHUB_BRANCH = os.getenv("GITHUB_BRANCH", "main")
ARTICLES_DIR = os.getenv("ARTICLES_DIR", "src/content/articles")  # Složka s články v repozitáři


def download_audio(video_url: str, output_dir: str) -> tuple[str, dict]:
    """
    Stáhne audio stopu z zadaného URL videa ve formátu MP3 pomocí yt-dlp.
    Vrací cestu k audio souboru a metadata videa (název, autor, url).
    """
    logger.info(f"📥 Skenuji a stahuji audio z URL: {video_url}")
    
    out_template = os.path.join(output_dir, "downloaded_audio_%(id)s.%(ext)s")
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': out_template,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'quiet': True,
        'no_warnings': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(video_url, download=True)
        video_title = info_dict.get('title', 'Video bez názvu')
        video_uploader = info_dict.get('uploader', info_dict.get('channel', 'Neznámý autor'))
        
        # Získání reálné cesty ke staženému MP3
        # yt-dlp po konverzi nahradí příponu za .mp3
        downloaded_file = ydl.prepare_filename(info_dict)
        base, _ = os.path.splitext(downloaded_file)
        mp3_filepath = base + ".mp3"
        
        if not os.path.exists(mp3_filepath):
            # Pokud se přejmenování nepovedlo přímo, prohledáme složku
            for file in os.listdir(output_dir):
                if file.endswith(".mp3"):
                    mp3_filepath = os.path.join(output_dir, file)
                    break

        if not os.path.exists(mp3_filepath):
            raise FileNotFoundError("Chyba při konverzi videa do MP3. Soubor nebyl nalezen.")

        metadata = {
            "title": video_title,
            "uploader": video_uploader,
            "url": video_url,
            "duration": info_dict.get('duration', 0)
        }

        logger.info(f"✅ Audio úspěšně staženo: {mp3_filepath} (Název videa: '{video_title}')")
        return mp3_filepath, metadata


def generate_article_with_gemini(audio_path: str, video_metadata: dict, api_key: str) -> str:
    """
    Nahraje audio soubor přes Google GenAI SDK a zpracuje ho modelem gemini-2.5-flash
    k vytvoření odborného článku.
    """
    logger.info("🤖 Inicializuji Google GenAI SDK a nahrávám audio soubor...")
    
    client = genai.Client(api_key=api_key)

    # 1. Nahrání audio souboru přes Files API
    logger.info(f"📤 Nahrávám {audio_path} do Gemini Files API...")
    uploaded_file = client.files.upload(file=audio_path)
    logger.info(f"✅ Soubor nahrán s ID: {uploaded_file.name}, stav: {uploaded_file.state}")

    # Počkáme, až bude soubor ve stavu ACTIVE (u audia to bývá téměř okamžitě)
    while uploaded_file.state.name == "PROCESSING":
        logger.info("⏳ Čekám na zpracování audio souboru na straně Google Cloud...")
        time.sleep(3)
        uploaded_file = client.files.get(name=uploaded_file.name)

    if uploaded_file.state.name != "ACTIVE":
        raise RuntimeError(f"Chyba při zpracování souboru v Gemini API: {uploaded_file.state.name}")

    # 2. Příprava Promptu pro článek
    system_prompt = """
Jsi špičkový právní analytik, rodinný poradce a copywriter pro specializovaný český web "Táta má právo" (tatamapravo.cz).
Tvá role je převést mluvené slovo z přiloženého audia do vysoce odborného, přehledného a empatičného článku v češtině.

Cílová skupina:
Otcové procházející opatrovnickým sporem, rozvodem, jednáním s OSPOD, soudy nebo bojující o střídavou/společnou péči.

Požadavky na strukturu článku v Markdownu:
1. H1 Nadpis: Výstižný, chytlavý a profesionální titulek vystihující hlavní téma.
2. Metadata nahoře (Frontmatter v YAML formátu, např.):
---
title: "NÁZEV ČLÁNKU"
date: "YYYY-MM-DD"
category: "Opatrovnické řízení / OSPOD / Práva otce"
original_url: "URL VIDEA"
uploader: "AUTOR VIDEA"
---
3. Perex: Krátký úvod (2-3 věty) shrnující hlavní poselství videa.
4. H2 Hlavní body & Právní/Psychologická analýza:
   - Rozděl téma do logických sekcí s podnadpisy (H2, H3).
   - Vysvětli klíčové termíny, zákony (např. OZ, ZSPOD, judikaturu Ústavního soudu), doporučení pro komunikaci s OSPOD a soudem.
   - Převeď nahodilé mluvené věty do strukturovaného, souvislého odborného textu.
5. H2 Klíčová doporučení pro otce (Odrážky):
   - Praktické kroky "Co dělat" a "Čemu se vyhnout".
6. Závěr: Povzbudivé shrnutí zdůrazňující nejlepší zájem dítěte a právo na oba rodiče.

Psací styl:
Písmenný, spisovná čeština, odborně přesný, bez patosu a agresivity, orientovaný na věcnost, fakta a zájem dítěte.
"""

    prompt = f"""
Prosím zpracuj přiložené audio z videa z kanálu '{video_metadata["uploader"]}' s původním názvem '{video_metadata["title"]}'.
Zdrojové URL: {video_metadata["url"]}

Vytvoř kompletní publikovatelný článek v češtině přesně podle výše uvedených pokynů.
"""

    try:
        logger.info("🧠 Generuji článek pomocí modelu gemini-2.5-flash...")
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[uploaded_file, prompt],
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.3,
            )
        )
        logger.info("✅ Článek úspěšně vygenerován!")
        return response.text

    finally:
        # Smazání souboru z Gemini Files API po zpracování
        try:
            logger.info(f"🗑️ Mažu dočasný soubor z Gemini Files API ({uploaded_file.name})...")
            client.files.delete(name=uploaded_file.name)
        except Exception as e:
            logger.warning(f"Varování: Nepodařilo se smazat soubor z Gemini Files API: {e}")


def push_to_github(article_md: str, video_title: str, repo: str, branch: str, token: str) -> str:
    """
    Odešle vygenerovaný Markdown článek do GitHub repozitáře přes GitHub REST API.
    """
    logger.info(f"🚀 Připravuji odeslání článku na GitHub ({repo}, větev: {branch})...")
    
    # Vytvoření čitelného násobu souboru ze slugify
    today_str = datetime.date.today().strftime("%Y-%m-%d")
    slug_title = slugify(video_title, max_length=50)
    file_name = f"{today_str}-{slug_title}.md"
    file_path = f"{ARTICLES_DIR}/{file_name}".strip("/")

    api_url = f"https://api.github.com/repos/{repo}/contents/{file_path}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json"
    }

    # Zjistíme, zda soubor na GitHubu již neexistuje (pro získání SHA)
    sha = None
    get_res = requests.get(api_url, headers=headers)
    if get_res.status_code == 200:
        sha = get_res.json().get("sha")
        logger.info(f"ℹ️ Soubor {file_path} již existuje, bude aktualizován (SHA: {sha}).")

    content_b64 = base64.b64encode(article_md.encode("utf-8")).decode("utf-8")

    payload = {
        "message": f"cms: Přidán nový článek z videa '{video_title}'",
        "content": content_b64,
        "branch": branch
    }
    if sha:
        payload["sha"] = sha

    logger.info(f"📤 Odesílám soubor '{file_path}' přes GitHub REST API...")
    put_res = requests.put(api_url, headers=headers, json=payload)

    if put_res.status_code in (200, 201):
        commit_url = put_res.json().get("commit", {}).get("html_url", "")
        logger.info(f"🎉 Článek úspěšně publikován na GitHub! Commit: {commit_url}")
        return file_path
    else:
        raise RuntimeError(f"Chyba při zápisu na GitHub (HTTP {put_res.status_code}): {put_res.text}")


def process_video_to_article(video_url: str):
    """
    Hlavní řídící funkce workflow.
    """
    # Kontrola klíčů
    if not GEMINI_API_KEY:
        logger.error("❌ Chybí proměnná prostředí GEMINI_API_KEY.")
        sys.exit(1)

    if not GITHUB_TOKEN:
        logger.error("❌ Chybí proměnná prostředí GITHUB_TOKEN.")
        sys.exit(1)

    audio_file_path = None
    temp_dir = tempfile.mkdtemp(prefix="tata_ma_pravo_")

    try:
        # 1. Stažení audia
        audio_file_path, metadata = download_audio(video_url, temp_dir)

        # 2. Generování článku pomocí Gemini 2.5 Flash
        article_md = generate_article_with_gemini(audio_file_path, metadata, GEMINI_API_KEY)

        # 3. Publikování do GitHub repozitáře
        published_path = push_to_github(
            article_md=article_md,
            video_title=metadata["title"],
            repo=GITHUB_REPO,
            branch=GITHUB_BRANCH,
            token=GITHUB_TOKEN
        )

        logger.info(f"✨ Vše dokončeno! Článek byl uložen do cesta: {published_path}")

    except Exception as e:
        logger.error(f"❌ Nastala chyba při zpracování: {e}", exc_info=True)
        sys.exit(1)

    finally:
        # Vždy uklidíme dočasné soubory na disku
        logger.info("🧹 Provádím úklid dočasných souborů...")
        if audio_file_path and os.path.exists(audio_file_path):
            try:
                os.remove(audio_file_path)
            except Exception as e:
                logger.warning(f"Nepodařilo se smazat audio soubor: {e}")

        if os.path.exists(temp_dir):
            try:
                for f in os.listdir(temp_dir):
                    os.remove(os.path.join(temp_dir, f))
                os.rmdir(temp_dir)
            except Exception as e:
                logger.warning(f"Nepodařilo se smazat dočasnou složku: {e}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("\nPoužití:")
        print("  python process_video_article.py <URL_VIDEA>\n")
        print("Příklad:")
        print("  python process_video_article.py https://www.youtube.com/watch?v=EXAMPLE_ID\n")
        sys.exit(1)

    video_url_arg = sys.argv[1]
    process_video_to_article(video_url_arg)
