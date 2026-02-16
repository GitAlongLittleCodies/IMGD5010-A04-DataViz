// Visualizing data from MontgomeryData 2024 Employee Salary dataset
 
// Question
// - When declaring a *new* variable from within setup() - why does it act like a local var when including 'let' and a global var when omitted?
// - To test if the data loaded, you can't declare the vars outside setup() -OR- could you test to make sure they aren't empty? No way to test that they are complete

// Data source = https://data.montgomerycountymd.gov/Human-Resources/Employee-Salaries-2024/2nq6-auk8/about_data
// Definitions = https://dev.socrata.com/foundry/data.montgomerycountymd.gov/2nq6-auk8

// Freeze Frame in use =====
let freezeMyFrame = true;
let myFrame = 1;
// =========================

let hue00 = "175";
let hue01 = "175";

function setup() {
  background(125);
  createCanvas(windowWidth, windowHeight);

  // !!! use let or var and myData turns into a local var !!!
  // dataset constrained: _2024_overtime_pay > $145,000
  // yields 10 records out of 10,398 total
  // these are the top 10 highest overtime earners in 2024
  myData = loadJSON(
    "https://data.montgomerycountymd.gov/resource/2nq6-auk8.json?$query=SELECT%20department%2C%20department_name%2C%20division%2C%20gender%2C%20base_salary%2C%20_2024_overtime_pay%2C%20_2024_longevity_pay%2C%20grade%20WHERE%20((%60_2024_overtime_pay%60%20%3E%20%27145000%27)%20AND%20%60_2024_overtime_pay%60%20IS%20NOT%20NULL)"
  );

  colorMode(HSB);
}

function draw() {
  if (freezeMyFrame) {
    console.log('Freeze Frame: ' + myFrame);
    // ========================= < FreezeMyFrame > ==================================

    // if the data isn't complete, nor is the variable
    if (myData === undefined) return;

    // collecting:
    // !!! converting to num using float then using math can return some unexpected results - like a very long decimal ie 265705.26999999996 !!!
    // _2024_overtime_pay
    // _2024_longevity_pay
    // base_salary
    // gender

    // console.log(myData);
    background(15);
    textAlign(CENTER);
    
// print(myData);
// print(Object.values(myData).length);
    
    for (let i = 0; i < Object.values(myData).length; i++) {

      let basePay = int(myData[i].base_salary);
      let overtimePay = int(myData[i]._2024_overtime_pay);
      let longevityPay = 0; // int(myData[i]._2024_longevity_pay);
      let totalPay = basePay + overtimePay + longevityPay;
      let partsTest = myData[i].gender;
      
      employeePay(i, basePay, overtimePay, longevityPay, totalPay, partsTest);
      
      // print('person: ' + i + '    base: ' + basePay + '    overtime: ' + overtimePay + '    longevity: ' + longevityPay + '    total: ' + totalPay);

      
    }

    // ========================= < /FreezeMyFrame > =================================
    freezeMyFrame = !freezeMyFrame;
    myFrame++;
  }
}

function employeePay( i, basePay, overtimePay, longevityPay, totalPay, partsTest ) {

  if (partsTest === "m" || partsTest === "M") { myHue = hue00; } 
    else { myHue = hue01; }
  
  push()
    translate(40 + 100 * i, height * 0.66);
    
  
    // employee
    push();
      fill(myHue, 100, 100, 1);
      text("Employee " + (i + 1), 40, 15);
    pop();
  
    // total
    push();
      fill(myHue, 15, 50, 1);
      noStroke();
      rect(2, 0, 5, -totalPay / 1000 - 50);
      rect(2, -totalPay / 1000 - 51, 74, 25)
      fill(myHue, 55, 15, 1);
      textStyle(BOLD);
      textSize(16);
      text( "$" + nfc(totalPay), 39, -totalPay / 1000 - 32);
    pop();

    // longevity
    push();
      textAlign(LEFT);
      fill(myHue, 100, 100 * (1 - longevityPay / totalPay), 1);
      rect(10, -longevityPay / 1000, 70, longevityPay / 1000);
    pop();

    // base pay
    // fill(myHue, 100, 100 * (1 - basePay / totalPay), 1);
    fill(myHue, 100, 70, 1);
    rect(10, -longevityPay / 1000, 70, -basePay / 1000);

    // overtime pay
    // fill(myHue, 100, 100 * (1 - overtimePay / totalPay), 1);
    fill(myHue, 100, 35, 1);
    rect(
      10, -basePay / 1000 - longevityPay / 1000 - overtimePay / 1000,
      70, overtimePay / 1000 );

    // 'Salary' and 'Overtime' labels
    fill(myHue, 100, 100, 1);
    // text('- Other: ' + round(longevityPay/totalPay*100,1) + '% -', 40, 30);
    text(
      "Salary:\n" + round((basePay / totalPay) * 100, 1) + "%",
      45, -basePay / 2000 - 10 );
    text(
      "Overtime:\n" + round((overtimePay / totalPay) * 100, 1) + "%",
      45, -basePay / 1000 - overtimePay / 2000 - 10 );
  pop()
}


function mousePressed() {
  freezeMyFrame = !freezeMyFrame; // Toggle state
  if (freezeMyFrame) {
    loop(); // Resume draw()
  } else {
    noLoop(); // Stop draw()
  }
}
