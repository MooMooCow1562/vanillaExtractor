let beans = {
	quantity : 1,
	plants : 0,
	productionRate : .025,
	rotRate : 0.9925,
	maxPlants : 0, 
	incrementMaxPlants : (quant)=>{maxPlants+=quant},
	vanilla : 0,
    conversionRate : 0.25,
    conversionDelayAmount : 10,
    conversionDelayContainer : null,
}

function getBeans() {
	return beans.quantity
}

function getPlants(){
	return beans.plants
}
function getProductionRateSeconds(){
	return beans.productionRate * 2
}

//for debug purpouses.
console.log(JSON.stringify(beans))

//handle planting events
function plant(event) {
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
    if (beans.quantity < amount) {
        return
    }
    beans.quantity -= amount;
    beans.plants += amount;
}

//handle growth/decay events.
function grow() {
    beans.quantity += beans.plants * beans.productionRate
    beans.plants *= beans.rotRate
    if (beans.plants < 0.01) {
        beans.plants = 0;
    }
    return beans.quantity
}

// check and handle disabling and enabling bean related buttons as needed
function updateButtonsThatRequireBeans() {
	//list of things to change
	let c100 = document.getElementById("Convert100")
	let c10 = document.getElementById("Convert10")
	let c1 = document.getElementById("Convert1")
	let p100 = document.getElementById("Plant100")
    let p10 = document.getElementById("Plant10")
    let p1 = document.getElementById("Plant1")
    
	if (beans.quantity >= 100) {
        c100.hidden = false;
        p100.hidden = false;
        c100.removeAttribute("disabled")
        p100.removeAttribute("disabled")
    } else {
        c100.setAttribute("disabled", "")
        p100.setAttribute("disabled", "")
    }
    if (beans.quantity >= 10) {
        c10.hidden = false;
        p10.hidden = false;
        c10.removeAttribute("disabled")
        p10.removeAttribute("disabled")
    } else {
        c10.setAttribute("disabled", "")
        p10.setAttribute("disabled", "")
    }
    if (beans.quantity >= 1) {
        c1.removeAttribute("disabled")
        p1.removeAttribute("disabled")
    } else {
        c1.setAttribute("disabled", "")
        p1.setAttribute("disabled", "")
    }
}

//handle conversion events
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
    if (conversionDelayContainer !== null || getBeans() < amount) {
        return
    }
    beans.quantity -= amount;
    document.getElementById("ConvertingT").hidden = false;
    document.getElementById('ConvertButtons').hidden = true
    conversionDelayContainer = setTimeout(() => {
        vanilla += (amount * conversionRate);
        conversionDelayContainer = null;
        document.getElementById("ConvertingT").hidden = true;
        document.getElementById('ConvertButtons').hidden = false;
    }, conversionDelayAmount * 1000 * (amount / 2));
}