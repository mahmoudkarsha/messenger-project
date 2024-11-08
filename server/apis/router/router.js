const multer = require('multer');
const express = require('express');

const { register, login, protectAdminOnly, ensureToken, protect, restricted } = require('../controllers/auth');
const { checkContact, usersList, getUsersStatus, closeAllUsers } = require('../controllers/user');
const { deleteMemberFromGroup, addMembersToGroup, createGroup } = require('../controllers/groups');
const { getFile, uploadFile, getProfileImage } = require('../controllers/files');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/login', login);
router.post('/register', protectAdminOnly, register);
router.post('/ensuretoken', ensureToken);
router.get('/checkcontact', checkContact);

//groups
router.post('/creategroup', restricted, createGroup);
router.post('/groups/deletemember', protect, deleteMemberFromGroup);
router.post('/groups/addmembers', protect, addMembersToGroup);

// delete group
// change group name
// change group avatar
// change group admins

//admin
router.post('/closeall', protectAdminOnly, closeAllUsers);
router.get('/userslist', protectAdminOnly, usersList);
router.get('/usersstatus', protectAdminOnly, getUsersStatus);

//files
router.post('/files', protect, upload.single('file'), uploadFile);
router.get('/files/:id', protect, getFile);
router.get('/profileimages/:number', getProfileImage);

module.exports = router;
