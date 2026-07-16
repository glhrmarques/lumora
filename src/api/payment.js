const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration))

export async function processMockPayment(payment) {
  await wait(1400)

  const cardDigits = payment.cardNumber.replace(/\D/g, '')

  if (!payment.cardholder.trim()) {
    throw new Error('Enter the name shown on the card.')
  }

  if (cardDigits.length !== 16) {
    throw new Error('Enter a valid 16-digit card number.')
  }

  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiration)) {
    throw new Error('Enter the expiration date as MM/YY.')
  }

  if (payment.cvv && !/^\d{3,4}$/.test(payment.cvv)) {
    throw new Error('CVV must contain 3 or 4 digits.')
  }

  if (cardDigits.endsWith('0000')) {
    throw new Error('The saved card was declined. Please update the card details and try again.')
  }

  return {
    confirmationId: `LUM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  }
}
