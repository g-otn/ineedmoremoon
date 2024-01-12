# I Need More Moon - Engravings

Visualize and search for names in the silicate engravings of the I Need More Moon project.

**http://g-otn.github.io/ineedmoremoon**

## I Need More Moon project

I Need More Moon is a project by [TJ Cooney](https://twitter.com/TJ_Cooney) to send thousands of names in digital and physical storage to the Moon on the Astrobotic Peregrine lander.

Learn more:

- ["Same Your Name to the Moon (Free)" - Youtube](https://www.youtube.com/watch?v=Gb1WrGvxO8M)
- [I Need More Moon Substack](https://ineedmoremoon.substack.com/)
- [Peregrine Mission One](https://en.wikipedia.org/wiki/Peregrine_Mission_One) (lander mission)
- [DHL MoonBox](https://en.wikipedia.org/wiki/DHL_MoonBox) (box containing the silicate)

## Technical details

### Raw data info

The raw data used, provided via Google Drive, were:

- Two high-resolution photos were provided (one for each side of the silicate disc).
  - These were upscaled and denoised using waifu2x for slighly better readibility.
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

2. Run `generate-data.js` to generate the `sides.json` file. It'll contain the metadata used to calculate the approximate position of each name in the images.

```
npm start
```

3. Serve the public folder by running `npm run serve`.

4. Access http://localhost:3000

### Tools used

- [anvaka/panzoom](https://github.com/anvaka/panzoom)
- jQuery, Bootstrap 5, and other utilities
- waifu2x
