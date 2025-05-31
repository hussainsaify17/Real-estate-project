const MeetingHistory = require('../../model/schema/meeting');

const add = async (req, res) => {
    try {
        const meeting = new MeetingHistory(req.body);
        await meeting.save();
        res.status(200).json(meeting);
    } catch (err) {
        console.error('Failed to create Meeting:', err);
        res.status(400).json({ error: 'Failed to create Meeting' });
    }
}

const index = async (req, res) => {
    try {
        const query = req.query
        query.deleted = false;

        let allData = await MeetingHistory.find(query).populate({
            path: 'createBy',
            match: { deleted: false } // Populate only if createBy.deleted is false
        }).exec()

        const meetings = allData.filter(item => item.createBy !== null);
        res.status(200).json(meetings);
    } catch (err) {
        console.error('Failed to get Meetings:', err);
        res.status(400).json({ error: 'Failed to get Meetings' });
    }
}

const view = async (req, res) => {
    try {
        const meeting = await MeetingHistory.findOne({ _id: req.params.id });
        if (!meeting) return res.status(404).json({ message: 'No data found.' });
        res.status(200).json(meeting);
    } catch (err) {
        console.error('Failed to get Meeting:', err);
        res.status(400).json({ error: 'Failed to get Meeting' });
    }
}

const deleteData = async (req, res) => {
    try {
        await MeetingHistory.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (err) {
        console.error('Failed to delete Meeting:', err);
        res.status(400).json({ error: 'Failed to delete Meeting' });
    }
}

const deleteMany = async (req, res) => {
    try {
        await MeetingHistory.updateMany({ _id: { $in: req.body } }, { $set: { deleted: true } });
        res.status(200).json({ message: 'Meetings deleted successfully' });
    } catch (err) {
        console.error('Failed to delete Meetings:', err);
        res.status(400).json({ error: 'Failed to delete Meetings' });
    }
}

module.exports = { add, index, view, deleteData, deleteMany }