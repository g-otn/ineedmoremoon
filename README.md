# I Need More Moon - Engravings

Visualize and search for names in the silicate engravings of the I Need More Moon project.

**http://g-otn.github.io/ineedmoremoon**

![demo](https://github.com/g-otn/ineedmoremoon/assets/44736064/7d105e40-2497-4c9a-b364-745e47c7624d)

## I Need More Moon project

I Need More Moon is a project by [TJ Cooney](https://twitter.com/TJ_Cooney) to send thousands of names in digital and physical storage to the Moon via the [Peregrine Mission One](https://en.wikipedia.org/wiki/Peregrine_Mission_One) in early 2023.
This was done by placing a small silicate disc engraved with names, alongside an SD-card for extra names and files in the DHL Moonbox, which was one of the payloads of the lander.

The mission failed due to a problem with the lander during the mission. (See lander mission link)

In early 2025, "I Need More Moon II" was announced, which will send the backup silicate disc copy via [Griffin Mission One](https://en.wikipedia.org/wiki/Astrobotic_Technology#Griffin_Mission_One), targeted for September 2025.

Learn more:

- 2025 "Mission 2"
  - I Need More Moon II announcement: ["My last moon mission exploded... so I'm trying again! Come Join!" - Youtube](https://www.youtube.com/watch?v=K4z8evBMJU8)
  - [I Need More Moon website](https://ineedmoremoon.com/)
  - Lander mission: [Griffin Mission One](https://en.wikipedia.org/wiki/Astrobotic_Technology#Griffin_Mission_One)

- 2020 "Mission 1"
  - I Need More Moon announcement: ["Send Your Name to the Moon (Free)" - Youtube](https://www.youtube.com/watch?v=Gb1WrGvxO8M)
  - Entry check: [I Need More Moon Substack](https://ineedmoremoon.substack.com/)
  - Lander mission: [Peregrine Mission One](https://en.wikipedia.org/wiki/Peregrine_Mission_One)
  - Box containing the silicate: [DHL MoonBox](https://en.wikipedia.org/wiki/DHL_MoonBox)

## Technical details

### Raw data info

The raw data used, provided via Google Drive, were:

- Two high-resolution photos were provided (one for each side of the silicate disc).
  - These were upscaled and denoised using waifu2x for slightly better readibility.
  - The photos have some defects because there was no time to get a better picture.
  - Hosted in Imgur with permission.
- Two `.txt` files containing the list of names (one for each side of the silicate disc), in "circular" formatting. See [data/names/raw](data/names/raw).
  - Taking advantage of this special formatting, it was possible to calculate the approximate position without having to rely on other methods such as OCR.

### Running

Requirements: Node.js

1. Clone the project

```bash
git clone https://github.com/g-otn/ineedmoremoon
```

2. (Optional) Run `generate-data.js` to generate the `sides.json` file.
   It'll contain the metadata used to calculate the approximate position of each name in the images.

```
npm start
```

3. Serve the public folder by running `npm run serve`.

4. Access http://localhost:3000

### Tools used

- [anvaka/panzoom](https://github.com/anvaka/panzoom)
- jQuery, Bootstrap 5, and other utilities
- waifu2x

