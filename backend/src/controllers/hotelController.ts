import { Request, Response } from 'express';
import Hotel from '../models/Hotel.js';

export async function getAllHotels(req: Request, res: Response) {
  console.log('🚀 [getAllHotels] Request received');
  try {
    const hotels = await Hotel.find();
    console.log(`✅ [getAllHotels] Found ${hotels.length} hotels`);
    res.json(hotels);
  } catch (err: any) {
    console.error('❌ [getAllHotels] Error fetching hotels:', err.message || err);
    res.status(500).json({ message: 'Failed to fetch hotels', error: err.message });
  }
}

export async function getHotelById(req: Request, res: Response) {
  console.log(`🚀 [getHotelById] Request received for id: ${req.params.id}`);
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      console.warn(`⚠️ [getHotelById] Hotel not found with id: ${req.params.id}`);
      return res.status(404).json({ message: 'Hotel not found' });
    }
    console.log(`✅ [getHotelById] Hotel found: ${hotel.name}`);
    res.json(hotel);
  } catch (err: any) {
    console.error(`❌ [getHotelById] Error fetching hotel id ${req.params.id}:`, err.message || err);
    res.status(500).json({ message: 'Failed to fetch hotel', error: err.message });
  }
}

export async function createHotel(req: Request, res: Response) {
  console.log("🚀 [createHotel] Request body:", JSON.stringify(req.body, null, 2));

  try {
    const newHotel = new Hotel(req.body);
    await newHotel.save();
    console.log(`✅ [createHotel] Hotel created with id: ${newHotel._id}`);
    res.status(201).json(newHotel);
  } catch (err: any) {
    console.error("❌ [createHotel] Error creating hotel:", err.message || err);
    res.status(500).json({ message: "Failed to create hotel", error: err.message });
  }
}


export async function deleteHotel(req: Request, res: Response) {
  console.log(`🚀 [deleteHotel] Request to delete hotel id: ${req.params.id}`);
  try {
    const deleted = await Hotel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.warn(`⚠️ [deleteHotel] Hotel not found with id: ${req.params.id}`);
      return res.status(404).json({ message: 'Hotel not found' });
    }
    console.log(`✅ [deleteHotel] Hotel deleted with id: ${req.params.id}`);
    res.json({ message: 'Hotel deleted' });
  } catch (err: any) {
    console.error(`❌ [deleteHotel] Error deleting hotel id ${req.params.id}:`, err.message || err);
    res.status(500).json({ message: 'Failed to delete hotel', error: err.message });
  }
}
// ✅ Add this at the bottom of your file

export async function updateHotel(req: Request, res: Response) {
  console.log(`✏️ [updateHotel] Update request for hotel id: ${req.params.id}`);
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!hotel) {
      console.warn(`⚠️ [updateHotel] Hotel not found: ${req.params.id}`);
      return res.status(404).json({ message: "Hotel not found" });
    }

    console.log(`✅ [updateHotel] Hotel updated: ${hotel.name}`);
    res.json(hotel);
  } catch (err: any) {
    console.error(`❌ [updateHotel] Error:`, err.message || err);
    res.status(500).json({ message: "Failed to update hotel", error: err.message });
  }
}
