export default {
    getConfigErrorMsg: (variable: string): string => 
    `It appears you have not set the ${variable} variable for the current environment appropriately, look into the .env.sample file to find out about all the neccessary variables for your current environment.`,
     getConfigBoolErrorMsg:  (variable: string): string => `${variable} can only be a boolean-like value`,
     NODE_ENV_REQUIRED: 'A NODE_ENV variable must be set to determine the current environment',
     INTERNAL_SERVER_ERROR: 'Oops, something broke on the server!!!',
     NOT_FOUND_PAYLOAD: {
        error: "Oops, You've reached a dead end",
        statusCode: 404
      },
      PING: "Thanks for dropping by, let's get the inventory show on the road !!!",
      logLevels: ['error', 'warning', 'info', 'debug', 'silly'],
      ADD_ITEM_ERROR: 'Error adding new item.',
      SELL_ITEM_ERROR: 'Error initializing item purchase',
      VALIDATE_SELLABLE_ERROR: 'Error validating the availability of purchasable stock of the item.',
      FETCH_AVAILABLE_ITEM_ERROR: 'Error retrieving the available quantity of the item.',
      RACE_CONDITION: 'RACE_CONDITION',
      funnyRaceWarning: (attempts: number): string => `A purchase got ahead of this one, but i'd retry ${attempts} more time(s).`,
      moreThanAvailableMsg: (quantity: number, name: string): string =>  `Only ${quantity} ${name}(s) is available for purchase as of the moment!!!.`,
      notAvailableMsg: (name: string): string => `There are no available stock of ${name} for purchase.`
      }