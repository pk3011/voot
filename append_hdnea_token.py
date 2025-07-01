import json

def load_token(token_file="fetch.txt"):
    with open(token_file, "r", encoding="utf-8") as f:
        return f.read().strip()

def update_channels_json(file_path="channels.json", token=""):
    with open(file_path, "r", encoding="utf-8") as f:
        content = json.load(f)

    for channel in content.get("data", []):
        url = channel.get("url", "")
        if url:
            # Remove old token if present
            base_url = url.split("__hdnea__=")[0].rstrip("&?")
            channel["url"] = f"{base_url}?{token}"

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=2)

if __name__ == "__main__":
    token = load_token("fetch.txt")
    update_channels_json("channels.json", token)
    print("✅ channels.json updated with latest __hdnea__ token.")
