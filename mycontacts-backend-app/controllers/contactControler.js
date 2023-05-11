const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc = get contacts
//route = GET /api/contacts
//@access = private

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id }); //get
  res.status(200).json(contacts);
  // res.status(200).json({ message: "Get the contacts" });
});

//@desc = Create new contacts
//route = POST /api/contacts
//@access = private

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const contacts = await Contact.create({
    //post
    name,
    email,
    phone,
    user_id: req.user.id,
  });
  res.status(200).json(contacts);
  // res.status(200).json({ message: "Create contacts" });
});

//@desc = get specific  contact
//route = GET /api/contacts/:id
//@access = private

const getContact = asyncHandler(async (req, res) => {
  const contacts = await Contact.findById(req.params.id);
  console.log(contacts, "contacts-----inn get 1 contact");
  if (contacts === null || !contacts) {
    res.status(404);
    throw new Error("Contact not found");
  }
  // res.status(200).json({ message: `Get contact for ${req.params.id}` });
  res.status(200).json(contacts);
});

//@desc = put contacts
//route = PUT /api/contacts/:id
//@access = private

const updateContact = asyncHandler(async (req, res) => {
  const contacts = await Contact.findById(req.params.id);
  console.log(contacts, "contacts-----in update");
  if (contacts == null) {
    res.status(404);
    throw new Error("Contact not found");
  }
  if (contacts.user_id.toString() !== req.user.id) {
    res.status(404);
    throw new Error("User don't have permission to update");
  }
  const updatecontacts = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  // res.status(200).json({ message: `Update contact for ${req.params.id}` });
  res.status(200).json(updatecontacts);
});

//@desc = delete contacts
//route = DELETE /api/contacts/:id
//@access = private
const deleteContact = asyncHandler(async (req, res) => {
  const contacts = await Contact.findById(req.params.id);
  console.log(contacts, "contacts----in delete-");
  if (contacts == null) {
    res.status(404);
    throw new Error("Contact not found");
  }
  if (contacts.user_id.toString() !== req.user.id) {
    res.status(404);
    throw new Error("User don't have permission to delete");
  }
  // await Contact.remove();
  await Contact.deleteOne({ _id: req.params.id });
  res.status(200).json(contacts);
  // res.status(200).json({ message: `Delete contact for ${req.params.id}` });
});
module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
