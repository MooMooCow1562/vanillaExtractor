const dialog = document.querySelector("#dialog")

let updateInterval
let money = 0
let numNames = ["#Money", "#Extract", "#Beans", "#PlantAmount", "#PlantOutput", "#BeanRate", '#RotRate']
let numValues = [money, vanilla, getBeans(), getPlants(), getProductionRateSeconds(), 0, ((1 - beans.rotRate) * 100)]
let buyButtons = document.querySelectorAll(".buyStuff")
let saleValue = 0.99

//event listeners for buttons.
document.querySelector("#close").addEventListener("click", () => dialogToggle())
for (const button of buyButtons) {
    switch (button.id.at(0)) {
        case 'P':   //is a planting button
            button.addEventListener("click", (e) => plant(e))
            break
        case 'C':   //is a conversion button
            button.addEventListener("click", (e) => convert(e))
            break
        case 'S':   //is a sell button
            button.addEventListener("click", (e) => sell(e))
            break
        default:
            console.log("There's a button here that there shouldn't be! Or it's not handled!")
            console.log(button)
    }
}

// implementation in progress
document.querySelector("#increaseConvert")
document.querySelector("#increaseSalePrice")
document.querySelector("#increaseBeanRate")
document.querySelector("#increaseConvertRate")
document.querySelector("#decreaseDecay")

// toggles the dialog!
function dialogToggle() {
    if (dialog.open) {
        dialog.close()
    } else {
        dialog.showModal()
    }
}

//check and handle disabling and enabling buttons that require extract
function updateButtonsThatRequireExtract() {
    if (vanilla >= 100) {
        document.getElementById("Sell100").hidden = false;
        document.getElementById("Sell100").removeAttribute("disabled")
    } else {
        document.getElementById("Sell100").setAttribute("disabled", "")
    }
    if (vanilla >= 10) {
        document.getElementById("Sell10").hidden = false;
        document.getElementById("Sell10").removeAttribute("disabled")
    } else {
        document.getElementById("Sell10").setAttribute("disabled", "")
    }
    if (vanilla >= 1) {
        document.getElementById("Sell1").hidden = false;
        document.getElementById("Sell1").removeAttribute("disabled")
    } else {
        document.getElementById("Sell1").setAttribute("disabled", "")
    }
}

//main game loop
function updateLoop() {
    if (vanilla < 1 && getBeans() < 1 && getPlants() === 0) {
        document.getElementById("Message").innerHTML = "Wow, I can't believe you found a way to lose the game!<br>👏👏👏👏👏👏👏👏👏👏"
        dialogToggle()
        clearInterval(updateInterval)
    }
    numValues = [money, vanilla, grow(), getPlants(), getProductionRateSeconds(), 0, ((1 - beans.rotRate) * 100)]
    numValues[5] = numValues[4] * numValues[3]

    updateButtonsThatRequireBeans()
    updateButtonsThatRequireExtract()
    for (let i = 0; i < numNames.length; i++) {
        let thing = numNames[i]
        let amount
        if (numValues[i] < 1000000) {
            amount = numValues[i].toFixed(2)
        } else {
            amount = numValues[i].toExponential()
        }
        document.querySelector(thing).innerHTML = amount
    }
}

//handle sale events
function sell(event) {
    let amount = 1;
    const target = event.target.id;
    switch (target) {
        case 'Sell1':
            //do nothing
            break
        case 'Sell10':
            amount *= 10
            break
        case 'Sell100':
            amount *= 100
            break
        default:
            console.log("There's a sell event here that there shouldn't be! Or it's not handled!")
            amount = 0;
    }
    if (vanilla < amount) {
        return
    }
    document.getElementById("Shop").hidden = false;
    vanilla -= amount;
    money += saleValue * amount;
}

updateInterval = setInterval(() => updateLoop(), 500)
setTimeout(() => dialog.showModal(), 499)