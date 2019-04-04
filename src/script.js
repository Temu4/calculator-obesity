//*variables
const calculatorObesity = document.querySelector('.calculator-obesity');
const formButton = document.querySelector('.form__button');
const calculationResult = document.querySelector('.calculation-result');
const resultHeader = document.querySelector('.result__header');
const resultRange = document.querySelector('.result__range');
const rangeValue = document.querySelector('.range__value');
const rangePercentage = document.querySelector('.range__percentage');
const resultTable = document.querySelector('.result__table');


//*initial data storage
const Data = {
	//users input
	gender: undefined,
	age: undefined,
	weight: undefined,
	height: undefined,
	waist: undefined,
	neck: undefined,
	hips: undefined,

	// Body Fat Percentage
	BFP: undefined,
	categories: [
		'Эссенциальный жир',
		'Спортсмены',
		'Хорошая физическая форма',
		'Норма',
		'Ожирение'
	],

	//Fat Mass
	FM: undefined,

	//Lean Mass
	LM: undefined,

	//ideal body fat percentage
	idealFatPercentage: {
		value: undefined,
		age: [
			20,
			25,
			30,
			35,
			40,
			45,
			50,
			55
		],
		forMale: [
			8.5,
			10.5,
			12.7,
			13.7,
			15.3,
			16.4,
			18.9,
			20.9
		],
		forFemale: [
			17.7,
			18.4,
			19.3,
			21.5,
			22.2,
			22.9,
			25.2,
			26.3
		],
	},

	//how much fat to lose
	loseFat: undefined,

	//array with lebels for table result
	labelsArr: [
		'Процент жира в организме',
		'Категория',
		'Масса жира',
		'Тощая масса',
		'Идеальный процент жира для данного возраста',
		'\"Лишний жир\"'
	]
};

//*array with results
let resultArr = [];

//*show/hide hips input field if female gender checked
const genderCheckboxes = document.querySelector('.form__checkboxes');
const femaleCheckbox = document.querySelector('.checkbox-female');
const hipsField = document.querySelector('.field--hip');

const showHiddenElement = (element) => element.classList.remove('hidden');
const hideElement = (element) => element.classList.add('hidden');

genderCheckboxes.addEventListener('change', () => {
	femaleCheckbox.checked === true ? showHiddenElement(hipsField) : hideElement(hipsField)
})

//*caching variables value from user's input
calculatorObesity.addEventListener('change', event => {
	switch (event.target.getAttribute('data-type')) {
		case 'gender':
			Data['gender'] = event.target.value;
			break;
		case 'age':
			(event.target.value >= 1 && event.target.value <= 150) ? Data['age'] = +event.target.value: null;
			break;
		case 'weight':
			(event.target.value >= 1 && event.target.value <= 300) ? Data['weight'] = +event.target.value: null;
			break;
		case 'height':
			(event.target.value >= 100 && event.target.value <= 350) ? Data['height'] = +event.target.value: null;
			break;
		case 'waist':
			(event.target.value >= 40 && event.target.value <= 200) ? Data['waist'] = +event.target.value: null;
			break;
		case 'neck':
			(event.target.value >= 20 && event.target.value <= 80) ? Data['neck'] = +event.target.value: null;
			break;
		case 'hips':
			(event.target.value >= 40 && event.target.value <= 200) ? Data['hips'] = +event.target.value: null;
			break;
	}
})

//*change button to aсtive if all values are
calculatorObesity.addEventListener('change', () => {
	if (Data['gender'] === 'male' && Data['age'] && Data['weight'] && Data['height'] && Data['waist'] && Data['neck']) {
		formButton.removeAttribute("disabled");
	} else if (Data['gender'] === 'female' && Data['age'] && Data['weight'] && Data['height'] && Data['waist'] && Data['neck'] && Data['hips']) {
		formButton.removeAttribute("disabled");
	} else {
		formButton.setAttribute("disabled", "disabled");
	}
})

//*formula for Body Fat Percentage (BFP) by USA Navy method (resultArr[0])
const BFPFormula = () => {
	if (Data['gender'] === 'male') {
		Data['BFP'] = (495 / (1.0324 - 0.19077 * Math.log10(Data['waist'] - Data['neck']) + 0.15456 * Math.log10(Data['height']))) - 450;
	} else if (Data['gender'] === 'female') {
		Data['BFP'] = (495 / (1.29579 - 0.35004 * Math.log10(Data['waist'] + Data['hips'] - Data['neck']) + 0.22100 * Math.log10(Data['height']))) - 450;
	}

	Data['BFP'] >= 0 ? Data['BFP'] = Data['BFP'].toFixed(1) : Data['BFP'] = 0;
	return resultArr.push(`${Data['BFP']}%`);
}

//*choose the category (resultArr[1])
const chooseCategory = () => {
	let category;
	if (Data['gender'] === 'male') {
		if (Data['BFP'] >= 2 && Data['BFP'] <= 5) {
			category = Data['categories'][0];
		} else if (Data['BFP'] > 5 && Data['BFP'] <= 13) {
			category = Data['categories'][1];
		} else if (Data['BFP'] > 13 && Data['BFP'] <= 17) {
			category = Data['categories'][2];
		} else if (Data['BFP'] > 17 && Data['BFP'] < 25) {
			category = Data['categories'][3];
		} else if (Data['BFP'] >= 25) {
			category = Data['categories'][4];
		} else {
			category = "у Вас нет лишнего жира";
		}
	} else if (Data['gender'] === 'female') {
		if (Data['BFP'] >= 10 && Data['BFP'] <= 14) {
			category = Data['categories'][0];
		} else if (Data['BFP'] >= 14 && Data['BFP'] <= 21) {
			category = Data['categories'][1];
		} else if (Data['BFP'] >= 21 && Data['BFP'] <= 25) {
			category = Data['categories'][2];
		} else if (Data['BFP'] >= 25 && Data['BFP'] <= 32) {
			category = Data['categories'][3];
		} else if (Data['BFP'] >= 32) {
			category = Data['categories'][4];
		} else {
			category = "у Вас нет лишнего жира";
		}
	}
	return resultArr.push(category);
}

//*formula for Fat Mass (resultArr[2])
const BFFormula = () => {
	Data['FM'] = ((Data['BFP'] * Data['weight']) / 100).toFixed(1);
	return resultArr.push(`${Data['FM']} кг`);
}

//*formula for Lean Mass (resultArr[3])
const LFFormula = () => {
	Data['LM'] = (Data['weight'] - Data['FM']).toFixed(1);
	return resultArr.push(`${Data['LM']} кг`);
}

//*choose ideal fat percentage (resultArr[4])
const chooseIdealFatPercentage = () => {
	let idealFatPercentage = [];
	//form an array with values
	Data['idealFatPercentage']['age'].forEach((item, index) => {
		if (Data['age'] <= item && Data['age'] <= 55) {
			Data['gender'] === 'male' ?
				idealFatPercentage.push(Data['idealFatPercentage']['forMale'][index]) :
				null;
			Data['gender'] === 'female' ?
				idealFatPercentage.push(Data['idealFatPercentage']['forFemale'][index]) :
				null;
		} else if (Data['age'] > 55) { //if age is more then 55 years
			Data['gender'] === 'male' ?
				idealFatPercentage.push(20.9) :
				null;
			// Data['gender'] === 'female' ? idealFatPercentage.push(26.3) : null;
		}
	})
	//choose min value from the array
	Data['idealFatPercentage']['value'] = Math.min(...idealFatPercentage);
	return resultArr.push(`${Data['idealFatPercentage']['value']}%`)
}

//*calculate fat weight to lose (resultArr[5])
const calculateFatToLose = () => {
	let idealFatMass = (Data['weight'] * Data['idealFatPercentage']['value']) / 100;
	Data['loseFat'] = (Data['FM'] - idealFatMass).toFixed(1);
	return Data['loseFat'] > 0 ?
		resultArr.push(`${Data['loseFat']} кг`) :
		resultArr.push(`у Вас нет лишнего жира`)
}

//*show result 
const showResult = () => {
	calculationResult.classList.remove('hidden');
}

//*show result header
const showResultHeader = () => {
	resultHeader.textContent = `Процент жира в организме ${Data['BFP']}%`;
}

//*show calculation range
const showRange = () => {
	rangePercentage.textContent = `${Data['BFP']}%`;
	Data['gender'] === 'male' ?
		rangeValue.setAttribute("style", `margin-top: ${(Data['BFP'])*9}px;`) :
		rangeValue.setAttribute("style", `margin-top: ${(Data['BFP'])*4}px;`);
}

//*show table with calculations result
const showTableWithResults = (arr1, arr2) => {
	resultTable.innerHTML = '';
	arr1.forEach((item, index) => {
		if (index % 2) {
			resultTable.innerHTML += `<tr class="tr--even"><td>${item}</td><td>${arr2[index]}</td></tr>`
		} else {
			resultTable.innerHTML += `<tr class="tr--odd"><td>${item}</td><td>${arr2[index]}</td></tr>`
		}
	})
}

formButton.addEventListener('click', () => {
	resultArr = [];
	console.log(`gender: ${Data['gender']}, age: ${Data['age']}, weight: ${Data['weight']}, height: ${Data['height']}, waist: ${Data['waist']}, neck: ${Data['neck']}, hips: ${Data['hips']}`);
	console.log(resultArr);
	BFPFormula();
	chooseCategory();
	BFFormula();
	LFFormula();
	chooseIdealFatPercentage();
	calculateFatToLose();
	console.log(`Data['idealFatPercentage']['value']: ${Data['idealFatPercentage']['value']}`);
	console.log(resultArr);
	console.log(Data['BFP'], Data['FM'], Data['LM'], );
	showResult();
	showResultHeader();
	showRange();
	showTableWithResults(Data['labelsArr'], resultArr);
});