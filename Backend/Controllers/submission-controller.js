const submission = require('../Models/submission-model')

const createSubmission = async (req, res) => {
    try {
        const { userId, problemId, code, status } = req.body;

        const newSubmission = await submission.create({ userId, problemId, code, status })

        res.status(201).json({
            message: 'Submission added successfully',
            submission: newSubmission
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error creating submission',
            error: error.message
        })
    }
}

const getSubmission = async (req, res) => {
    try {
        const { userId, problemId } = req.params;

        const submissions = await submission.find({ userId, problemId })

        if (submissions.length > 0) {
            res.json({
                message: 'Submissions Made by user:',
                submissions: submissions
            })
        } else {
            res.json({
                message: "You haven't made any submission for this Problem"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching submissions',
            error: error.message
        })
    }
}

module.exports = { createSubmission, getSubmission }