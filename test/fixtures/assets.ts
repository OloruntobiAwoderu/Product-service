export const pingReply = {
    message:  "Hello World!!!"
}

export const sampleItems = {
   foo: [{
        quantity: 10,
        expiry: new Date().getTime() + 60000
    },
    {
        quantity: 20,
        expiry: new Date().getTime() + 120000
    },
    {
        quantity: 40,
        expiry: new Date().getTime() + 180000
    },
    {
        quantity: 40,
        expiry: new Date().getTime() + 240000
    }]
}
 

export const itemQuantityError = 'Quantity cannot be less than 1';

export const itemExpiryTooPastError = 'Expiry date should preferable be in the future and not later than the 1970';

export const sellPayload = {
    quantity: 1
}

export const fetchItemPayload = {
    quantity: 9
}