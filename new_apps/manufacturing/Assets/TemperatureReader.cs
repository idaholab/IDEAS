using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TemperatureReader : MonoBehaviour
{
    public TextAsset jsonTempFile;

    void Start()
    {
        Temperatures temperatureInJson = JsonUtility.FromJson<Temperatures>(jsonTempFile.text);

        foreach (Temperature temperatur in temperatureInJson.temperatures)
        {
            Debug.Log("Temperature: " + temperatur.value+ " " + temperatur.timestamp);
        }
    }
}
