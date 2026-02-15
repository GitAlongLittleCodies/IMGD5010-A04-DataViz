// Visualizing data from MontgomeryData 2024 Employee Salary dataset

// Question
// - When declaring a *new* variable from within setup() - why does it act like a local var when including 'let' and a global var when omitted?
// - To test if the data loaded, you can't declare the vars outside setup() -OR- could you test to make sure they aren't empty? No way to test that they are complete

// Data source = https://data.montgomerycountymd.gov/Human-Resources/Employee-Salaries-2024/2nq6-auk8/data_preview
// Definitions = https://dev.socrata.com/foundry/data.montgomerycountymd.gov/2nq6-auk8

// Freeze Frame in use =====
let freezeMyFrame = true;
let myFrame = 1;
// =========================


let hue00 = '50';
let hue01 = '125';

function setup() {
  background(125);
  createCanvas(windowWidth, windowHeight);

  // !!! use let or var and myData turns into a local var !!!
  // dataset constrained: _2024_overtime_pay > $145,000
  // yields 10 records out of 10,398 total 
  // they are the top 10 highest overtime earners in 2024
  myData = loadJSON(
    'https://data.montgomerycountymd.gov/resource/2nq6-auk8.json?$query=SELECT%20department%2C%20department_name%2C%20division%2C%20gender%2C%20base_salary%2C%20_2024_overtime_pay%2C%20_2024_longevity_pay%2C%20grade%20WHERE%20((%60_2024_overtime_pay%60%20%3E%20%27145000%27)%20AND%20%60_2024_overtime_pay%60%20IS%20NOT%20NULL)');
  
  colorMode(HSB);

}

function draw() {
  if (freezeMyFrame) {
    // ========================= < FreezeMyFrame > ==================================

    // if the data isn't complete, nor is the variable
    if ( myData === undefined ) return;
    
    // collecting:
    // !!! converting to num using float then using math can return some unexpected results - like a very long decimal like 265705.26999999996 !!!
    // _2024_overtime_pay
    // _2024_longevity_pay
    // base_salary
    // gender
    
    // console.log(myData);
    background(15)
    textAlign(CENTER);

    let i = 0;
    let basePay = int(myData[i].base_salary);
    let overtimePay = int(myData[i]._2024_overtime_pay);
    let longevityPay = int(myData[i]._2024_longevity_pay);
    let totalPay = basePay + overtimePay + longevityPay ;
    let gender = myData[i].gender;
    
    employeePay(i, basePay, overtimePay, longevityPay, totalPay, gender);

    // print('person: ' + i + '    base: ' + basePay + '    overtime: ' + overtimePay + '    longevity: ' + longevityPay + '    total: ' + totalPay);


    // ========================= < /FreezeMyFrame > =================================
    freezeMyFrame = !freezeMyFrame;
    myFrame++;
  }
}


function employeePay(i, basePay, overtimePay, longevityPay, totalPay, gender) {

  if (gender==='m' || gender==='M') 
    { hue = hue00;} 
  else { hue = hue01; }
    translate(40+80*i,height*.66);
  
    // total
    push();
    fill(hue,100,50,1);
    noStroke();
    rect(0,0,10,-totalPay/1000); 
    pop()

    // longevity
    push()
    textAlign(LEFT)
    fill(hue,100,100 * ( 1 - (longevityPay/totalPay) ) ,1);
    rect(10,-longevityPay/1000,
          70, longevityPay/1000);
    pop()

    // base pay
    fill(hue,100,100 * ( 1 - (basePay/totalPay) ) ,1);
    rect( 10, -longevityPay/1000, 
          70, -basePay/1000 );

    // overtime pay
    fill(hue,100,100 * ( 1 - (overtimePay/totalPay) ) ,1);
    rect(10,-basePay/1000-longevityPay/1000-overtimePay/1000,
          70, overtimePay/1000);

    // text
    fill(hue,100,100,1);
    push();
  textStyle(BOLD);
  textSize(16);
    text('$' + nfc(totalPay), 39, -basePay/1000-overtimePay/1000-longevityPay/1000-5);
  pop();
    text('Employee ' + i, 40, 15);
    text('- Other: ' + round(longevityPay/totalPay*100,1) + '% -', 40, 30);
    text('Salary:\n' + round(basePay/totalPay*100,1) + '%', 45, -basePay/2000-10);
    text('Overtime:\n' + round(overtimePay/totalPay*100,1) + '%', 45, -basePay/1000-overtimePay/2000-10);

}


function mousePressed() {
  freezeMyFrame = !freezeMyFrame; // Toggle state
  if (freezeMyFrame) {
    loop(); // Resume draw()
  } else {
    noLoop(); // Stop draw()
  }
}
