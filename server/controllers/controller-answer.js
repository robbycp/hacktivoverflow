const Answer = require('../models/model-answer')
const Question = require('../models/model-question')

class ControllerAnswer {
  static create(req, res, next) {
    let newAnswer = {
      title: req.body.title,
      content: req.body.content,
      user_id: req.userId,
      question_id: req.body.question_id
    }
    let newCreatedAnswer
    Answer.create(newAnswer)
      .then((createdAnswer) => {
        newCreatedAnswer = createdAnswer
        return Question.findById(req.body.question_id)
      })
      .then((question) => {
        question.answers.push(newCreatedAnswer)
        return question.save()
      })
      .then((updatedQuestion) => {
        res.json(newCreatedAnswer)
      })
      .catch(next)
  }

  static readAllAnswerOneUser(req, res, next) {
    Answer.find({ user_id: req.params.userId })
      .populate('user_id', 'full_name email username _id')
      .then((answers) => {
        res.json(answers)
      })
      .catch(next)
  }
  
  static update(req, res, next) {
    let schemaField = Object.keys(Answer.prototype.schema.paths)
    let filteredField = Object.keys(req.body).filter((x) => schemaField.indexOf(x) > -1)
    let updatedAnswer = filteredField.reduce((acc, el) => Object.assign(acc, {[el]: req.body[el]}), {})
    Answer.findByIdAndUpdate(req.params.id, updatedAnswer, { new: true, useFindAndModify: false })
      .then((answer) => {
        res.status(201).json(answer)
      })
      .catch(next)
  }
  
  static delete(req, res, next) {
    let id = req.params.id
    Answer.findById(id)
      .then((answer) => {
        if (!answer) throw { code: 404 }
        else {
          return Question.findById(answer.question_id)
        } 
      })
      .then((question) => {
        question.answers = question.answers.filter((answer) => (answer._id == req.params.id) ? false : true)
        let promiseQuestion = question.save()
        let promiseAnswer = Answer.deleteOne({ _id: id})
        return Promise.all([promiseQuestion, promiseAnswer])
      })
      .then((values) => {
        let resultQuestion = values[0]
        let resultAnswer = values[1]
        res.status(201).json(resultQuestion)
      })
      .catch(next)
  }

  static vote(req, res, next) {
    Answer.findById(req.params.id)
      .then((answer) => {
        if (!answer) throw { code: 404, message: 'Answer not found' }
        else {
          let indexUpVote = answer.upvotes.findIndex(el => el._id == req.userId)
          let indexDownVote = answer.downvotes.findIndex(el => el._id == req.userId)
          let endPath = req.path.split('/')          
          let voteType = (endPath[endPath.length - 1] === 'upvote') ? 'upvote' : 'downvote'
          if ((indexDownVote > -1 && voteType == 'downvote') 
            || (indexUpVote > -1 && voteType == 'upvote')) {
            throw { code: 400, message: `You've ${voteType} this answer`}
          } else {
            if (indexDownVote > -1) {
              answer.downvotes.splice(indexDownVote, 1)
              answer.upvotes.push(req.userId)
            } else if (indexUpVote > -1) {
              answer.upvotes.splice(indexUpVote, 1)
              answer.downvotes.push(req.userId)
            } else {
              console.log('belum pernah vote')
              if (voteType === 'upvote') {
                answer.upvotes.push(req.userId)
              } else if (voteType === 'downvote') {
                answer.downvotes.push(req.userId)
              }
            }
            return answer.save()
          }
        }
      })
      .then((answer) => {
        res.status(201).json(answer)
      })
      .catch(next)
  }
}

module.exports = ControllerAnswer