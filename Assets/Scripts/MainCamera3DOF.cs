using UnityEngine;

// Rastreamento 3DOF (apenas orientação/giroscópio)
public class MainCamera3DOF : MonoBehaviour
{
    [Header("Configurações")]
    public float suavidade = 0.9f;
    public Transform menuRaiz;

    void Start()
    {
        // Liga giroscópio do celular
        Input.gyro.enabled = true;
    }

    void Update()
    {
        // Lê rotação real do aparelho
        Quaternion rotCelular = Input.gyro.attitude;
        
        // Ajusta e suaviza para não ficar tremido
        Quaternion rotCorrigida = new Quaternion(rotCelular.x, rotCelular.y, 
                                                 -rotCelular.z, -rotCelular.w);
        transform.rotation = Quaternion.Lerp(transform.rotation, rotCorrigida, suavidade);

        // Menu segue SEMPRE sua visão
        if (menuRaiz != null)
            menuRaiz.rotation = transform.rotation;
    }
}
