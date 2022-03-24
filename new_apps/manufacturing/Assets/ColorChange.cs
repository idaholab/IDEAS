using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ColorChange : MonoBehaviour
{
    public Color nullColor, redColor, blueColor;
    Color currentColor;
    MeshRenderer customMeshRenderer;

    // Start is called before the first frame update
    void Start()
    {
        customMeshRenderer = GetComponent<MeshRenderer>();
        customMeshRenderer.material.color = redColor;
        currentColor = redColor;
    }

    // Update is called once per frame
    void Update()
    {
        if(Input.GetKeyDown(KeyCode.Space))
        {
            if(currentColor == redColor)
            {
                currentColor = blueColor;
            }
            else
            {
                currentColor = redColor;
            }
        }

        customMeshRenderer.material.color = Color.Lerp(customMeshRenderer.material.color, currentColor, 0.01f);
    }
}
