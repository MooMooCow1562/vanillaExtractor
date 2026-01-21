const dialog = document.querySelector("#dialog")

let updateInterval
let money = 0
let vanilla = 0
let vanillaBeans = 1
let planted = 0
let productionRate = .025
let rotRate = 0.9925;
let conversionRate = 1.0 / 4
let conversionDelayAmount = 10
let conversionDelayContainer = null
let numNames = ["#Money", "#Extract", "#Beans", "#PlantAmount", "#PlantOutput", "#BeanRate", '#RotRate']
let numValues = [money, vanilla, vanillaBeans, planted, productionRate * 2, 0, ((1 - rotRate) * 100)]
let buyButtons = document.querySelectorAll(".buyStuff")
let saleValue = 0.99

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
document.querySelector("#increaseConvert")
document.querySelector("#increaseSalePrice")
document.querySelector("#increaseBeanRate")
document.querySelector("#increaseConvertRate")
document.querySelector("#decreaseDecay")

function dialogToggle() {
    if (dialog.open) {
        dialog.close()
    } else {
        dialog.showModal()
    }
}

function updateButtonsThatRequireBeans() {
    if (vanillaBeans >= 100) {
        document.getElementById("Convert100").hidden = false;
        document.getElementById("Convert100").removeAttribute("disabled")
        document.getElementById("Plant100").hidden = false;
        document.getElementById("Plant100").removeAttribute("disabled")
    } else {
        document.getElementById("Convert100").setAttribute("disabled", "")
        document.getElementById("Plant100").setAttribute("disabled", "")
    }
    if (vanillaBeans >= 10) {
        document.getElementById("Convert10").hidden = false;
        document.getElementById("Convert10").removeAttribute("disabled")
        document.getElementById("Plant10").hidden = false;
        document.getElementById("Plant10").removeAttribute("disabled")
    } else {
        document.getElementById("Convert10").setAttribute("disabled", "")
        document.getElementById("Plant10").setAttribute("disabled", "")
    }
    if (vanillaBeans >= 1) {
        document.getElementById("Convert1").removeAttribute("disabled")
        document.getElementById("Plant1").removeAttribute("disabled")
    } else {
        document.getElementById("Convert1").setAttribute("disabled", "")
        document.getElementById("Plant1").setAttribute("disabled", "")
    }
}

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

function updateLoop() {
    if (vanilla < 1 && vanillaBeans < 1 && planted === 0) {
        document.getElementById("Message").innerHTML = "Wow, I can't believe you found a way to lose the game!<br>👏👏👏👏👏👏👏👏👏👏"
        dialogToggle()
        clearInterval(updateInterval)
    }
    numValues = [money, vanilla, grow(), planted, productionRate * 2, 0, ((1 - rotRate) * 100)]
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

function plant(event) {
    document.getElementById("farm").hidden = false
    let amount = 1;
    const target = event.target.id;
    switch (target) {
        case 'Plant1':
            //do nothing
            break
        case 'Plant10':
            amount *= 10
            break
        case 'Plant100':
            amount *= 100
            break
        default:
            console.log("There's a plant event here that there shouldn't be! Or it's not handled!")
            amount = 0;
    }
    if (vanillaBeans < amount) {
        return
    }
    vanillaBeans -= amount;
    planted += amount;
}

function convert(event) {
    let amount = 1;
    const target = event.target.id;
    switch (target) {
        case 'Convert1':
            //do nothing
            break
        case 'Convert10':
            amount *= 10
            break
        case 'Convert100':
            amount *= 100
            break
        default:
            console.log("There's a convert event here that there shouldn't be! Or it's not handled!")
            amount = 0;
    }
    if (conversionDelayContainer !== null || vanillaBeans < amount) {
        return
    }
    vanillaBeans -= amount;
    document.getElementById("ConvertingT").hidden = false;
    document.getElementById('ConvertButtons').hidden = true
    conversionDelayContainer = setTimeout(() => {
        vanilla += (amount * conversionRate);
        conversionDelayContainer = null;
        document.getElementById("ConvertingT").hidden = true;
        document.getElementById('ConvertButtons').hidden = false;
    }, conversionDelayAmount * 1000 * (amount / 2));
}

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

function grow() {
    planted *= rotRate
    if (planted < 0.01) {
        planted = 0;
    }
    vanillaBeans += planted * productionRate
    return vanillaBeans
}

updateInterval = setInterval(() => updateLoop(), 500)
setTimeout(() => dialog.showModal(), 499)