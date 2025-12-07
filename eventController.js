const Event = require("../models/Event")
const Joi = require("joi");
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ createdAt: -1 })
    res.json(events);
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
};

// Create event
const eventSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .pattern(/^[A-Za-z ]+$/)
    .required(),
  email: Joi.string().email().required(),
  eventType: Joi.string().valid("Workshop", "Seminar", "Conference").required(),
  participants: Joi.array().items(Joi.string().valid("John", "Jane", "Doe", "Alice", "Bob")).min(1).required(),
  eventDate: Joi.date().greater("now").required(),
  description: Joi.string().max(500).allow(""),
});

exports.createEvent = async (req, res) => {
  try {
    const { error, value } = eventSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: error.details.map((d) => d.message) });
    }

    // Create event
    const ev = await Event.create({
      ...value,
      owner: req.user?.sub,
    });

    res.status(201).json(ev);
  } catch (e) {
    console.log(e, 'e')
    res.status(400).json({ error: e.message })
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id)
    if (!ev) return res.status(404).json({ error: "Not found" })
    res.json(ev);
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { name, email, eventType, participants, eventDate, description } = req.body
    const ev = await Event.findByIdAndUpdate(
      req.params.id,
      { name, email, eventType, participants, eventDate, description },
      { new: true }
    );
    if (!ev) return res.status(404).json({ error: "Not found" })
    res.json(ev);
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const del = await Event.findByIdAndDelete(req.params.id)
    if (!del) return res.status(404).json({ error: "Not found" })
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
};
