# ChatGPT image prompts — FUJIBAN

Generate each image in ChatGPT, download it, and save it under the **exact filename** into `public/scene/`.
The site picks the images up automatically when they exist; until then it shows the vector version.

Tips:
- Ask for **"transparent background, PNG"** exactly as written. If it gives you a checkerboard *painted into* the image, say: "the background must be truly transparent (alpha), not a checkerboard."
- If something is off, reply in the same chat with ONE correction at a time ("make the snow cap larger", "less saturated"). Don't restart.
- Ask for landscape **1536×1024**.

---

## 1. `fuji.png` — the mountain (most important)
```
Photorealistic Mount Fuji, isolated cutout on a fully transparent background (PNG with alpha), no sky, no clouds, no ground, no text.
Symmetrical classic cone shape, perfectly centered horizontally, the summit at about 45% from the top of the image, the base of the mountain touching the bottom edge and spanning the full width of the image.
Crisp white snow cap with natural ridges and gullies streaking down, blue-grey volcanic rock below the snow, soft even early-morning light from the front, subtle atmospheric haze toward the base.
Shot with a telephoto lens, high detail, calm, minimal, Japanese fine-art photography. Landscape 1536x1024.
```

## 2. `foreground.png` — treeline in front of the mountain
```
Photorealistic silhouette of a Japanese forest treeline and low hills, seen from far away, isolated on a fully transparent background (PNG with alpha), no sky.
The trees occupy only the bottom 25% of the image and run edge to edge across the full width, soft morning mist drifting between the trees, dark blue-green tones, gentle uneven skyline of cedar and pine tops.
Minimal, calm, high detail. Landscape 1536x1024.
```

## 3. `mist.png` — optional low fog bank
```
Realistic soft white morning mist / low cloud bank, a long horizontal band floating in the lower-middle of the image, wispy, semi-transparent edges,
isolated on a fully transparent background (PNG with alpha), nothing else in the image. Landscape 1536x1024.
```

---

### When you're done
Tell me "images are in". I'll align the summit with the rising sun and tune the night/dawn color grade.
