from PIL import Image
import os

def clean_sprite(path, target='green'):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return
    img = Image.open(path).convert('RGBA')
    data = img.getdata()
    new_data = []
    
    for r, g, b, a in data:
        # Green screen detection: G is high relative to R and B
        if target == 'green':
            if g > 150 and g > r + 30 and g > b + 30:
                new_data.append((0, 0, 0, 0))
            else:
                new_data.append((r, g, b, a))
        # White screen detection: All high
        elif target == 'white':
            if r > 240 and g > 240 and b > 240:
                new_data.append((0, 0, 0, 0))
            else:
                new_data.append((r, g, b, a))
        # Black screen detection: All low
        elif target == 'black':
            if r < 40 and g < 40 and b < 40:
                new_data.append((0, 0, 0, 0))
            else:
                new_data.append((r, g, b, a))
        else:
            new_data.append((r, g, b, a))
            
    img.putdata(new_data)
    img.save(path, 'PNG')
    print(f"Cleaned {path}")

# Clean TIM (Green)
clean_sprite('assets/images/tim.png', 'green')
# Clean BUG (Green)
clean_sprite('assets/images/bug.png', 'green')
# Clean TREE (Green)
clean_sprite('assets/images/tree.png', 'green')
# Clean GEM (Green)
clean_sprite('assets/images/gem.png', 'green')
# Clean SHOCKWAVE (Black)
clean_sprite('assets/images/shockwave.png', 'black')
