import sys
from PIL import Image

def remove_color(image_path, target_color, tolerance=10):
    img = Image.open(image_path)
    img = img.convert("RGBA")
    data = img.getdata()
    
    new_data = []
    tr, tg, tb = target_color
    
    for item in data:
        # Calculate distance
        r, g, b, a = item
        if abs(r - tr) <= tolerance and abs(g - tg) <= tolerance and abs(b - tb) <= tolerance:
            new_data.append((255, 255, 255, 0)) # fully transparent
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(image_path.replace(".png", "_transparent.png"), "PNG")
    print(f"Processed: {image_path}")

# Bright green background
remove_color("/Users/alara/.gemini/antigravity/brain/72877cff-17c1-49df-bc69-3327a68b1ed3/tim_walk_spritesheet_1776365518368.png", (0, 255, 0), tolerance=30)
remove_color("/Users/alara/.gemini/antigravity/brain/72877cff-17c1-49df-bc69-3327a68b1ed3/game_props_sheet_1776365535453.png", (0, 255, 0), tolerance=30)
remove_color("/Users/alara/.gemini/antigravity/brain/72877cff-17c1-49df-bc69-3327a68b1ed3/bug_walk_spritesheet_1776365556347.png", (0, 255, 0), tolerance=30)

# Solid black background for shockwave
remove_color("/Users/alara/.gemini/antigravity/brain/72877cff-17c1-49df-bc69-3327a68b1ed3/shockwave_spritesheet_1776365568513.png", (0, 0, 0), tolerance=20)
