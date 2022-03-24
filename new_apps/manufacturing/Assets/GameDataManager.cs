// Add System.IO to work with files!
using System.IO;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using SimpleJSON;

public class GameDataManager : MonoBehaviour
{
    // Create a field for the save file.
    string saveFile;

    int diffInTime = 0;
    int currentTimeSec = 0;
    int prevTimeSec = 0;

    int initialTime = 0;
    int counter = 0;
    int timeDiffCounter = 0;

    float timer = 0.0f;

    float arrowPosition = -1.481f;
    int arrowMoveTime = 0;
    //IEnumerator co;

   

    Dictionary<int, string> tempDict = new Dictionary<int, string>();


    [SerializeField] TMPro.TextMeshProUGUI temp_Object;
    [SerializeField] TMPro.TextMeshProUGUI pressure_Object;


    Vector2 original = new Vector2(-0.1481f, 0.1481f);

    // Create a GameData field.
    //Temperature gameData = new Temperature();

    Coroutine co;
    bool enableArrow = true;
    bool stopped = false;
    void Awake()
    {
        // Update the path once the persistent path exists.
        //Debug.Log(Application.dataPath);
        saveFile = Application.dataPath + "/temp.json";
        Debug.Log("Save File Path " + saveFile);
    }
    private IEnumerator coroutine;


    void Start()
    {

        readFile();

        foreach (KeyValuePair<int, string> i in tempDict)
        { //you can use this  to return keys and values (key value pair)
          //  Debug.Log("@@ " + i.Key);// i.Key will rwtun the key for that KVP
          //  Debug.Log("$$ " + i.Value);// i.Value returns value fot the KVP
        }
        // co = onCoroutine(); // create an IEnumerator object
        //StartCoroutine(co(3));
        //var co = StartCoroutine(StartCounting(1));

        //StopCoroutine(co);

        //print("Starting " + Time.time);
        coroutine = WaitAndPrint(1);
        StartCoroutine(coroutine);
        //print("Done " + Time.time);


    }

    // print to the console every 3 seconds.
    // yield is causing WaitAndPrint to pause every 3 seconds
    public IEnumerator WaitAndPrint(int waitTime)
    {

        while (true)
        {
            yield return new WaitForSeconds(waitTime);
            //Debug.Log("Time before " + (int)Time.time + " INITIAL " + initialTime + " TTT " + (int)Time.time);
            string value;
            bool hasValue = tempDict.TryGetValue( (int)Time.time, out value);
            //Debug.Log("hasValue " + hasValue);
            if (hasValue)
            {
                Vector3 tempPosition = new Vector3(Mathf.Lerp(-0.1527f, 0.128f, Mathf.InverseLerp(0, 10, float.Parse(value))), 0.2027f, 1.2425f);
                Vector3 pressurePosition = new Vector3(Mathf.Lerp(-0.1527f, 0.128f, Mathf.InverseLerp(0, 10, float.Parse(value))), 0.0884f, 1.2425f);


                //Debug.Log(" Vavlue : " + tempPosition.x + " y " + tempPosition.y + " z " + tempPosition.z);
                GameObject.Find("TArrow52").transform.position = tempPosition;

                //Debug.Log(" Vavlue@@@@ : " + tempPosition.x + " y " + tempPosition.y + " z " + tempPosition.z);
                GameObject.Find("PArrow52").transform.position = pressurePosition;

                temp_Object.text = "Current Temperature: " + (Mathf.Lerp(0f, 1700f, Mathf.InverseLerp(0, 10, float.Parse(value)))).ToString() + "c";

                pressure_Object.text = "Current Pressure: " + (Mathf.Lerp(0f, 1000f, Mathf.InverseLerp(0, 10, float.Parse(value)))).ToString() + "mpa";

                //Debug.Log("TemperatureValue " + Mathf.Lerp(0f, 1700f, Mathf.InverseLerp(0, 10, float.Parse(value))));
                //GameObject.Find("TArrow5").transform.position = new Vector3(, 0.0395f, 0.0f);
                //Mathf.Lerp(-0.1481f, 0.1481f, Mathf.InverseLerp(0, 10, float.Parse(value))
            }
            //if ((int)Time.time -1 == arrowMoveTime) {
            //    Debug.Log("Position of the arrow " + arrowPosition + " Time " + arrowMoveTime);
            //    GameObject.Find("TArrow5").transform.position = new Vector3(arrowPosition,0.0395f, 0.0f);
            //    enableArrow = true;
            //}
            //print("WaitAndPrint " + (int)Time.time);
        }
    }

    void Update()
    {
        //if (Input.GetKeyDown("space"))
        //{
        //    StopCoroutine(coroutine);
        //    print("Stopped " + Time.time);
        //}

        //if (Input.GetKey(KeyCode.A))
        //{
        //    StartCoroutine(coroutine);
        //    //print("Done 2 " + Time.time);
        //}
        //if (Input.GetKey(KeyCode.B))
        //{
        //    StopCoroutine(coroutine);
        //    print("Stopped $$$ " + Time.time);
        //}
    }

    //IEnumerator StartCounting(int diffInTime)
    //{
    //    for (int i = 0; i <= diffInTime; i++)
    //    {
            
    //        yield return new WaitForSeconds(diffInTime);
    //        if (i == diffInTime)
    //            print(i + " second");
    //    }
    //}

    //const float min = 0.0f;
    //const float max = 10.0f;
    //float normalize(float input)
    //{
    //    float average = (min + max) / 2;
    //    float range = (max - min);
    //    float normalized_x = ((input - min) / range)* 0.2962f;
    //    return normalized_x;
    //}

    public void readFile()
    {
        // Does the file exist?
        if (File.Exists(saveFile))
        {
            // Read the entire file and save its contents.
            //string fileContents = File.ReadAllText(saveFile);

            // Deserialize the JSON data 
            //  into a pattern matching the GameData class.
            //gameData = JsonUtility.FromJson<Temperature>(fileContents);

            //Temperatures temperatureInJson = JsonUtility.FromJson<Temperatures>(fileContents);

            //foreach (Temperature temperatur in temperatureInJson.temperatures)
            //{
            //    Debug.Log("Temperature: " + temperatur.value );
            //}

            ////Debug.Log("I am in the gameData " + gameData);
            //Debug.Log("rAJIV");


            string jsonString = File.ReadAllText(saveFile);
            JSONNode data = JSON.Parse(jsonString);
            //Debug.Log(data);

            int index = 0;
            foreach (JSONNode record in data["temperature"])
            {

                //var scaledValue = Mathf.InverseLerp(0 / 0.1481f, -0.1481f, 0.1481f);
                //Debug.Log("Scaled Value " + scaledValue);

                //Debug.Log("nombre: " + record["value"].Value + "score: " + record["timestamp"].Value);

                System.TimeSpan span = (System.DateTime.Parse(record["timestamp"].Value) - new System.DateTime(1970, 1, 1, 0, 0, 0, 0).ToLocalTime());

                System.Int32 unixTimestamp = (System.Int32)(System.DateTime.Parse(record["timestamp"].Value).Subtract(new System.DateTime(1970, 1, 1))).TotalSeconds;
                
               
                currentTimeSec = unixTimestamp;
                string dateValue = record["timestamp"].Value;
                //tempDict.Add(float.Parse(record["value"].Value, (System.Globalization.NumberStyles)currentTimeSec));
                
                if (counter == 0)
                {
                    initialTime = currentTimeSec;
                }

                //int tempValue = System.Int32.Parse(record["value"].Value);
                //tempDict.Add(tempValue, initialTime.ToString());

                tempDict.Add(currentTimeSec - initialTime, record["value"].Value);
                counter++;
                
                
                //if (counter == 0)
                //{
                //    initialTime = currentTimeSec;
                //}
                ////while (index >= 0)
                ////{
                ////Vector3 ar = new Vector3(Mathf.Lerp(-0.1481f, 0.1481f, Mathf.InverseLerp(0, 10, float.Parse(record["value"].Value))), 0.0395f, 0.0f);
                //while (enableArrow)
                //{
                //    arrowMoveTime = currentTimeSec - initialTime;
                //    arrowPosition = Mathf.Lerp(-0.1481f, 0.1481f, Mathf.InverseLerp(0, 10, float.Parse(record["value"].Value)));
                //    Debug.Log("Below Arrow Time " + arrowMoveTime + " arrowPositio bel " + arrowPosition);
                //    enableArrow = false;
                //}
                //counter++;
                //index++;
                //if (counter == 0)
                //{
                //    diffInTime = 0;
                //    Vector3 tempPosition = new Vector3(Mathf.Lerp(-0.1481f, 0.1481f, Mathf.InverseLerp(0, 10, float.Parse(record["value"].Value))), 0.0395f,0.0f);
                //    GameObject.Find("TArrow5").transform.position = tempPosition;


                //}
                //else
                //{
                //    diffInTime = currentTimeSec - prevTimeSec;
                //    Debug.Log("Difference Time " + diffInTime);

                //    float valueRecord = float.Parse(record["value"].Value);
                //    //StartCoroutine(SomeCoroutine(diffInTime, valueRecord));
                    

                //    //for(int i=1; i<= diffInTime; i++)
                //    //{
                //    //    timer += Time.deltaTime;
                //    //    int seconds = (int)(timer % 60);
                //    //    Debug.Log("Time Value " + seconds);
                //    //    if (i == diffInTime)
                //    //    {
                //    //        Vector3 tempPosition = new Vector3(Mathf.Lerp(-0.1481f, 0.1481f, Mathf.InverseLerp(0, 10, float.Parse(record["value"].Value))), 0.0395f, 0.0f);
                //    //        GameObject.Find("TArrow5").transform.position = tempPosition;

                //    //    } 
                //    //    timeDiffCounter++;
                //    //}
                //    timer = 0;

                //    timeDiffCounter = 0;
                //}
                //counter++;
                //prevTimeSec = unixTimestamp;
            }
        }
    }
    IEnumerator SomeCoroutine(int differenceTime, float valueRecord)
    {
        //Declare a yield instruction.
        WaitForSeconds wait = new WaitForSeconds(differenceTime);

        for (int i = 0; i < differenceTime; i++)
        {
            //Do some logic
            Vector3 tempPosition = new Vector3(Mathf.Lerp(-0.1481f, 0.1481f, Mathf.InverseLerp(0, 10, valueRecord)), 0.0395f, 0.0f);
            GameObject.Find("TArrow5").transform.position = tempPosition;
            Debug.Log("Loop Value " + i + " , Wait " + wait);
            
            yield return wait; //Pause the loop for 3 seconds.
        }
    }

    public void writeFile()
    {
        // Serialize the object into JSON and save string.
        //string jsonString = JsonUtility.ToJson(gameData);

        // Write JSON to file.
       // File.WriteAllText(saveFile, jsonString);
    }
}