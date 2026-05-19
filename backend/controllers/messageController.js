const Message = require('../models/Message');
const Stadium = require('../models/Stadium');

const sendMessage = async (req, res, next) => {
  try {
    let { receiver, stadium, text } = req.body;

    if (!receiver && stadium) {
      const stadiumRecord = await Stadium.findById(stadium).select('owner');
      if (!stadiumRecord) {
        res.status(404);
        throw new Error('Stadium not found');
      }
      receiver = stadiumRecord.owner;
    }

    if (!receiver) {
      res.status(400);
      throw new Error('Receiver is required');
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver,
      stadium: stadium || undefined,
      text
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role')
      .populate('stadium', 'name')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getMessages };
