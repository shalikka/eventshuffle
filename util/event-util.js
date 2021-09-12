const formatVotes = (votes) => {
  return votes.map(vote => {
      return {
        date: vote.date.toISOString().split('T')[0],
        people: vote.people
      }
    }
  )
}

const formatDateStrings = (dates) => {
  return dates.map(date => new Date(date).toISOString().split('T')[0])
}

module.exports = {
  formatVotes,
  formatDateStrings
}
