/*
  link between the computer and the SoftSerial Shield
  at 9600 bps 8-N-1
  Computer is connected to Hardware UART
  SoftSerial Shield is connected to the Software UART:D2&D3
*/

#include <Wire.h>
#include <Digital_Light_TSL2561.h>
#include <SoftwareSerial.h>

SoftwareSerial SoftSerial(2, 3);
char buffer[64];       // buffer array for data receive over serial port
int count = 0;                    // counter for buffer array
boolean done = false;
boolean homesent = false;

void setup()
{
    Wire.begin();
    TSL2561.init();
    SoftSerial.begin(9600);     // the SoftSerial baud rate
  Serial.begin(9600);         // the Serial port of Arduino baud rate.
  //Serial.println("HOME");
  done = false;
}

void loop()
{
// Read Light value
  int ligthtVal = TSL2561.readVisibleLux();
  
  // if date is coming from software serial port ==> data is coming from SoftSerial shield
  if (SoftSerial.available())
  {
    while (SoftSerial.available())              // reading data into char array
    {
      buffer[count++] = SoftSerial.read();      // writing data into array
      delay(5);
    }
    done = true;
    homesent = false;
  } else {
    // Pas de tag rfid
    if (ligthtVal > 20 && !homesent) {
      Serial.println("HOME");
      homesent = true;
    }
  }

  // Envoie du code
  if (done) {
    Serial.flush();
    SoftSerial.flush();
    Serial.write(buffer, count);     // if no data transmission ends, write buffer to hardware serial port
    clearBufferArray();             // call clearBufferArray function to clear the stored data from the array
    count = 0;
    done = false;
  }
}
void clearBufferArray()                 // function to clear buffer array
{
  // clear all index of array with command NULL
  for (int i = 0; i < count; i++)
  {
    buffer[i] = NULL;
  }
}
