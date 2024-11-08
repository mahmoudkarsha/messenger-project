const Group = require('../../database/models/groups');

exports.addMembersToGroup = catchAsync(async (req, res, next) => {});
exports.deleteMemberFromGroup = catchAsync(async (req, res, next) => {});

exports.createGroup = catchAsync(async (req, res, next) => {
    const io = req.io;
    const { group_name, members, owners, is_channel } = req.body;

    if (!group_name) throw new Error('');

    const newGroup = await Group.create({
        group_name,
        owners,
        is_channel,
        members,
    });

    members.forEach((m) => {
        io.to(m).emit('added-to-new-group', newGroup);
    });

    res.json({
        status: 'success',
    });
});

function catchAsync(fn) {
    return (req, res, next) => fn(req, res, next).catch(next);
}

//
