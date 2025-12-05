const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const { getCache, setCache, clearCache } = require('../utils/cache');
const authMiddleware = require('../middleware/authMiddleware');
const cloudinary = require('../utils/cloudinary');   // 👈 new
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() }); // keep in RAM

const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

router.get('/dish',authMiddleware, async (req, res) => {
  const cached = getCache('dishes');
  if (cached) return res.json(cached);

  try {
    const dishes = await Dish.find();
    setCache('dishes', dishes, ONE_WEEK);
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/dish',authMiddleware, async (req, res) => {
  try {
    const dish = new Dish(req.body);
    const newDish = await dish.save();
    clearCache('dishes');
    res.status(201).json(newDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/dish/:id', authMiddleware, async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.json(dish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/dish/:id',authMiddleware, async (req, res) => {
  try {
    const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDish) return res.status(404).json({ message: 'Dish not found' });

    clearCache('dishes');
    res.json(updatedDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/dish/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDish = await Dish.findByIdAndDelete(id);
    if (!deletedDish) return res.status(404).json({ message: 'Dish not found' });

    // Delete all Cloudinary resources in this recipe folder
    const folderPrefix = `MyKitchen/recipes/${id}`;

    try {
      // remove all assets under this folder
      await cloudinary.api.delete_resources_by_prefix(folderPrefix);
      // remove the folder itself
      await cloudinary.api.delete_folder(folderPrefix);
    } catch (cloudErr) {
      console.error('Error deleting Cloudinary folder:', cloudErr);
      // we won't fail the whole request for this, just log it
    }

    clearCache('dishes');
    res.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// POST /api/food/dish/:id/images
router.post(
  '/dish/:id/images',
  authMiddleware,
  upload.single('image'),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      const dish = await Dish.findById(id);
      if (!dish) {
        return res.status(404).json({ message: 'Dish not found' });
      }

      // Convert buffer to data URI for Cloudinary
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      const folderPath = `MyKitchen/recipes/${id}`; // 👈 folder per recipe

      const uploadResult = await cloudinary.uploader.upload(fileStr, {
        folder: folderPath,
      });

      const imageEntry = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };

      dish.images = dish.images || [];
      dish.images.push(imageEntry);
      await dish.save();

      clearCache('dishes');

      return res.status(201).json(dish); // return updated dish
    } catch (error) {
      console.error('Error uploading image:', error);
      return res.status(500).json({ message: 'Failed to upload image' });
    }
  }
);

// DELETE /api/food/dish/:id/images/:publicId
router.delete(
  '/dish/:id/images/:publicId',
  authMiddleware,
  async (req, res) => {
    try {
      const { id, publicId } = req.params;

      const dish = await Dish.findById(id);
      if (!dish) {
        return res.status(404).json({ message: 'Dish not found' });
      }

      // Delete from Cloudinary
      await cloudinary.uploader.destroy(publicId);

      // Remove from document
      dish.images = (dish.images || []).filter(
        (img) => img.publicId !== publicId
      );
      await dish.save();

      clearCache('dishes');

      return res.json(dish);
    } catch (error) {
      console.error('Error deleting image:', error);
      return res.status(500).json({ message: 'Failed to delete image' });
    }
  }
);


module.exports = router;
