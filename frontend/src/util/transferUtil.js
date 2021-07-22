export function parseVal(rawVal) {
    // Remove \n, \r
    let newVal = rawVal.replace(/"/g, "");
    // let newVal = rawVal.replace(/\n/g, ",");
    newVal = newVal.replace(/\r/g, "");
    // newVal = newVal.replace(/(?:\\[rn])+/g, "");
    return newVal;
};

export function standardizeColumnNames(rawColumnVals) {
    let res = [];
    rawColumnVals.forEach((val, i) => {
        const original = val;
        val = val.toLowerCase();
        if (val.includes('date')) {
            // Transfer or Post date
            if (val.includes('post') && !res.includes('Post Date')) {
                res.push('Post Date');
            } else if (!res.includes('Date')) {
                res.push('Date');
            }
        } else if (val.includes('desc') && !res.includes('Description')) {
            res.push('Description');
        } else if (val.includes('category') && !res.includes('Category')) {
            res.push('Category');
        } else if (val.includes('amount') && !res.includes('Amount')) {
            res.push('Amount');
        } else {
            res.push(original);
        }
    });
    return res;
};

export function standardizeTransfer(rawRow, rowIndex, columnVals) {
    // Return array of transfer properties that are correctly ordered and standardized
    if (!rawRow) {
        console.log('no row?', rowIndex);
        return;
    }
    if (rawRow.length !== columnVals.length) {
        console.log('weird row', rawRow);
    }

    let parsedRowValues = [];
    let ignoreIndexes = [];
    columnVals.forEach((expectedColumn, i) => {
        // Increment index for accessing raw row data when we've already skipped row
        let searchIndex = i + ignoreIndexes.length;
        const rawVal = rawRow[searchIndex];
        if (!rawVal) {
            console.log('TODO invalid crap', i);
            return;
        }
        let parsedVal;
        if (expectedColumn === 'Description') {
            if (rawVal.charAt(0) === '"' && rawVal.charAt(rawVal.length - 1) !== '"') {
                // Description probably split across multiple columns
                let nextVal = rawRow[searchIndex + 1];
                if (nextVal.charAt(0) !== '"' && nextVal.charAt(nextVal.length - 1) === '"') {
                    // Description got split across 2 columns
    
                    // Combine and drop leading/trailing quotes
                    parsedVal = parseVal(rawVal + nextVal);
                    parsedRowValues.push(parsedVal);
    
                    ignoreIndexes.push(searchIndex+1);
                    return;
                }
            }
        }
        parsedRowValues.push(parseVal(rawVal));
    });


    return parsedRowValues;
};

export function calcUploadInfo(headers, transfers) {
    // Convert into array of JSON objects for each transfer
    let transfersJson = transfers.map((t, i) => {
        
        return {
            date: t[headers.indexOf('Date')],
            postDate: t[headers.indexOf('Post Date')],
            description: t[headers.indexOf('Description')],
            amount: t[headers.indexOf('Amount')],
            category: t[headers.indexOf('Category')],
        };
    });
    return transfersJson;
};

export function calcUploadMeta(transfers) {
    // Calculate net, total expenses from json transfers
    if (!transfers) {
        console.log('invalid transfers to generate meta from');
        return null;
    }

    // let net = transfers.reduce((a, b) => a + (b[key] || 0), 0);
    let net = 0;
    let total_expenses = 0;
    let subscription_total = 0;
    let possible_subscriptions = [];
    transfers.forEach((t, i) => {
        const { amount, category, date, description, subscription } = t;
        const formattedAmount = parseFloat(amount);
        if (formattedAmount) {
            net += formattedAmount;
            if (formattedAmount > 0) {
                total_expenses += formattedAmount;
            }
        }
        if (subscription) {
            subscription_total += formattedAmount;
        }
        if (description) {
            if (description.includes('/BILL')) {
                possible_subscriptions.push({
                    index: i,
                    amount,
                    date, 
                });
                return;
            } else if (description.startsWith('AUDIBLE*')) {
                possible_subscriptions.push({
                    index: i,
                    amount,
                    date, 
                });
                return;
            }
        }

        if (category) {
            if (category === 'Services') {
                possible_subscriptions.push({
                    index: i,
                    amount,
                    date,
                });
                return;
            }
        }
    });

    return {
        net: net.toFixed(2),
        total_expenses: total_expenses.toFixed(2),
        subscription_total: subscription_total.toFixed(2),
        possible_subscriptions,
    };
};

// Unused
export function isDate(date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
};
