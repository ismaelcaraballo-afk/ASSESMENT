/**
 * Urgency Scorer - Rule-based urgency calculation
 */

export function calculateUrgency(message) {
  const text = message.toLowerCase()
  let urgencyScore = 0

  const keywordWeights = [
    ['outage', 45],
    ['server down', 55],
    ['down', 35],
    ['production', 30],
    ['database', 25],
    ['connection lost', 35],
    ['cannot access', 30],
    ["can't access", 30],
    ['locked out', 30],
    ['payment failed', 30],
    ['charged twice', 25],
    ['refund', 15],
    ['error', 20],
    ['bug', 15],
    ['crash', 25],
    ['timeout', 20],
    ['security', 35],
    ['breach', 60],
    ['urgent', 25],
    ['asap', 20],
    ['immediately', 20],
    ['critical', 30]
  ]

  keywordWeights.forEach(([keyword, weight]) => {
    if (text.includes(keyword)) urgencyScore += weight
  })

  const positiveWords = ['thank', 'thanks', 'appreciate', 'love', 'great', 'excellent', 'wonderful', 'happy', 'feedback']
  positiveWords.forEach(word => {
    if (text.includes(word)) urgencyScore -= 20
  })

  const featureRequestIndicators = ['feature request', 'would like to see', 'could you add', 'suggestion', 'enhancement']
  featureRequestIndicators.forEach(phrase => {
    if (text.includes(phrase)) urgencyScore -= 10
  })

  if (text.includes('?') && urgencyScore === 0) {
    urgencyScore -= 5
  }

  if (urgencyScore >= 50) return 'High'
  if (urgencyScore <= 10) return 'Low'
  return 'Medium'
}
