#include <SPI.h>
#include <MFRC522.h>
#include <LiquidCrystal.h>// include the library code:
const int rs = 3, en = 2, d4 = 5, d5 = 6, d6 = 7, d7 = 8;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);


#define SS_PIN 10 //RX slave select
#define RST_PIN 9

MFRC522 mfrc522(SS_PIN, RST_PIN); // Create MFRC522 instance.

byte card_ID[4]; //card UID

//Add as many cards you want
byte Name1[4]={0x76,0x80,0x78,0xF8}; 
byte Name2[4]={0x99,0x35,0x72,0xA9};
byte Name3[4]={0x99,0x35,0x72,0xA9};
byte Name4[4]={0x99,0x35,0x72,0xA9};
byte Name5[4]={0x99,0x35,0x72,0xA9};
byte Name6[4]={0x99,0x35,0x72,0xA9};
/*byte Name2="76,80,78,F8";//first UID card
String Name2="09090990";//second UID card
String Name3="15353114169";//third UID card
String Name4="13937143185";//fourth UID card
String Name5="2174114201";//
String Name6="254161178115";//and so on.*/

int NumbCard[6];//the number of cards. in my case I have 6 cards.
int j=0;  //incresd by one for every user you add 
int statu[6];//the number of cards. in my case I have 6 cards.
int s=0;  //incresd by one for every user you add 

int const RedLed=4;
int const GreenLed=5;
int const Buzzer=8;

String Log;
String Name;//user name
long Number;//user number
int n ;//The number of card you want to detect (optional)  
int ID=1;

void setup() {
  lcd.begin(16, 2);
  Serial.begin(9600); // Initialize serial communications with the PC
  SPI.begin();  // Init SPI bus
  mfrc522.PCD_Init(); // Init MFRC522 card
  
  Serial.println("CLEARSHEET");                 // clears starting at row 1
  Serial.println("LABEL,ID,Date,Name,Number,Card ID,Time IN,Time OUT");// make four columns (Date,Time,[Name:"user name"]line 48 & 52,[Number:"user number"]line 49 & 53)

  pinMode(RedLed,OUTPUT);
  pinMode(GreenLed,OUTPUT);
  pinMode(Buzzer,OUTPUT);
  
  lcd.setCursor(2,0);
  lcd.print("VALIDATE ID");//Wlecome Message will appear in the beginning. 
  delay(500);
   }
   
void loop() {
cont1:
  //look for new card
   if ( ! mfrc522.PICC_IsNewCardPresent()) {
  return;//got to start of loop if there is no card present
 }
 // Select one of the cards
 if (  ! mfrc522.PICC_ReadCardSerial()) {
  return;//if read card serial(0) returns 1, the uid struct contians the ID of the read card.
 }

 for (byte i = 0; i < mfrc522.uid.size; i++) {
     card_ID[i]= mfrc522.uid.uidByte[i];
 
 
// Serial.println(card_ID);//Uncomment this line to scan the card ID and appear it on Serial monitor.
 
       if(card_ID[i]==Name1[i]){
       Name="HEMANT";//user name
       Number=20765;//user number
       j=0;//incresd by one for every user you add
       s=0;//++1
      }
      else if(card_ID[i]==Name2[i]){
       Name="Second employee";//user name
       Number=789101;//user number
       j=1;//++1
       s=1;//++1
      }
      /*else if(card_ID==Name3){
       Name="Third employee";//user name
       Number=789101;//user number
       j=2;//++1
       s=2;//++1
      }
      else if(card_ID==Name4){
       Name="Fourth employee";//user name
       Number=789101;//user number
       j=3;//++1
       s=3;//++1
      }
      else if(card_ID==Name5){
       Name="Fiveth employee";//user name
       Number=789101;//user number
       j=4;//++1
       s=4;//++1
      }
      else if(card_ID==Name6){
       Name="Sixth employee";//user name
       Number=789101;//user number
       j=5;//incresd by one for every user you add
       s=5;//++1
      }*/
      else{
          digitalWrite(GreenLed,LOW);
          digitalWrite(RedLed,HIGH);
          lcd.clear();
          lcd.setCursor(0,0);
          lcd.print("unidentified ");
          lcd.setCursor(4,1);
          lcd.print("Try again....");
          delay(1000);
       /*lcd.setCursor(0,0);
       lcd.print("unidentified");//printed in line 2
       lcd.setCursor(0,1);
       lcd.print("Try again...");*/
          goto cont;//go directly to line 188
     }
 }

      if(NumbCard[j] == 1 && statu[s] == 0){
      statu[s]=1;
      NumbCard[j] = 0;
       lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Student IN:");//printed in line 2
       lcd.setCursor(4,1);
       lcd.print(Name);//printed in line 2
      Serial.print("DATA,");//send the Name to excel
      Serial.print(ID);
      Serial.print(",");
      Serial.print("DATE");
      Serial.print(",");
      Serial.print(Name);
      Serial.print(",");
      Serial.print(Number); //send the Number to excel
      Serial.print(",");
      //Serial.print(card_ID); //send the card ID to excel
      Serial.print(",");
      Serial.print("");
      Serial.print(",");
      Serial.println("TIME");
      ID=ID+1;
      digitalWrite(GreenLed,HIGH);
      digitalWrite(RedLed,LOW);
      digitalWrite(Buzzer,HIGH);
      delay(30);
      digitalWrite(Buzzer,LOW);
      }
      else if(NumbCard[j] == 0){
      NumbCard[j] = 1;
      statu[s]=0;
      n++;//(optional)
       lcd.clear();
       lcd.setCursor(0,0);
       lcd.print("Student out ");
       lcd.setCursor(4,1);
       lcd.print(Name);
      Serial.print("DATA,");//send the Name to excel
      Serial.print(ID);
      Serial.print(",");
      Serial.print("DATE");
      Serial.print(",");
      Serial.print(Name);
      Serial.print(",");
      Serial.print(Number); //send the Number to excel
      Serial.print(",");
      //Serial.print(card_ID); //send the card ID to excel
      Serial.print(",");
      Serial.print("TIME");
      Serial.print(",");
      Serial.println("");
      digitalWrite(GreenLed,HIGH);
      digitalWrite(RedLed,LOW);
      digitalWrite(Buzzer,HIGH);
      delay(500);
      digitalWrite(Buzzer,LOW);
      ID=ID+1;
      }
   /* else if(statu[s] == 1){
     lcd.clear();
     lcd.setCursor(0,0);
     lcd.print(Name);
     lcd.setCursor(0,1);
     lcd.print("Already Left");
      }*/
      delay(1000);
       lcd.clear();
       lcd.setCursor(2,0);
       lcd.print("VALIDATE ID");

cont:
/*lcd.clear();
lcd.setCursor(0,0);
lcd.print("unidentified ");
lcd.setCursor(4,1);
lcd.print("Try again....");
delay(200);*/
digitalWrite(GreenLed,LOW);
digitalWrite(RedLed,LOW);
card_ID[4];
delay(500);
lcd.clear();
lcd.setCursor(2,0);
lcd.print("VALIDATE ID");
goto cont1;
       
       

//if you want to close the Excel when all card had detected and save Excel file in Names Folder. in my case i have just 2 card 
/*if(n==2){
    Serial.println("SAVEWORKBOOKAS,Names/WorkNames");
    Serial.println("FORCEEXCELQUIT");
    }*/
}