const fs = require('fs')
const path = require('path')
const csvParser = require('csv-parser')

printArrays()

function printArrays() {
    console.log('printArrays')

    fs.readdir('./output/grainIntegration/', function(err, files) {
        if (err) {
            console.error(err)
            return
        }
        
        files.forEach(function(file) {
            const filePath = path.join('./output/grainIntegration/', file)
            if (filePath.endsWith('.csv')) {
                let csvRows = []
                fs.createReadStream(filePath)
                    .pipe(csvParser(['receiver', 'amount']))
                    .on('data', (row) => {
                        insertRow(csvRows, row)
                    })
                    .on('end', () => {
                        console.log('\nfilePath', filePath)
                        csvRows = pruneRows(csvRows)
                        // console.log('csvRows:\n', csvRows)

                        let recipients = []
                        let values = []
                        csvRows.forEach(function(row, index) {
                            recipients[index] = row.receiver
                            values[index] = row.amount
                        })
                        console.log('recipients:\n', JSON.stringify(recipients).replaceAll('"', ''))
                        console.log('values:\n', JSON.stringify(values).replaceAll('"', ''))
                    })
            }
        })
    })
}

function insertRow(rows, row) {
    let newRow = {}
    newRow.receiver = row.receiver
    newRow.amount = row.amount
    newRow.name = ''
    newRow.token_type = 'erc20'
    newRow.token_address = '0xe29797910d413281d2821d5d9a989262c8121cc2'
    rows.push(newRow)
}

function pruneRows(rows) {
    const floor = 0
    let pruned = rows.filter(row => row.amount > floor)
    return pruned
}
