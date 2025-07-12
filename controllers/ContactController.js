const Contact = require("../modals/ContactUs")

const ContactUs = async (req, res) => {
  try {
    const { name, email, contact, pincode, message } = req.body;

    // Validation
    if (!name || !email || !contact || !pincode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save message
    const savedMessage = await Contact.create({
      name:name.trim(),
      email:email.trim(),
      contact:contact.trim(),
      pincode:pincode.trim(),
      message:message.trim()
    });

    return res.status(201).json({
      message: "Your message has been received!",
      data: savedMessage,
    });
  } catch (err) {
    console.error("Something went wrong:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = ContactUs;