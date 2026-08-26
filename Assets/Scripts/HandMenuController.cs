using UnityEngine;
using UnityEngine.UI;

// Controla menu flutuante com detecção de mão
public class HandMenuController : MonoBehaviour
{
    [Header("Itens do Menu")]
    public GameObject[] botoes;
    public float raioDetectavel = 0.5f;

    // Chamado quando dedo aponta/toca item
    public void SelecionarItem(int indice)
    {
        if (indice < 0 || indice >= botoes.Length) return;
        
        // Destaque visual
        foreach(var btn in botoes)
            btn.transform.localScale = Vector3.one;

        botoes[indice].transform.localScale = Vector3.one * 1.15f;
        Debug.Log($"✅ Selecionado: Item {indice}");
        // Aqui depois liga funções: abrir cenas, apps, etc.
    }

    // Simples função para detectar posição da mão no espaço 3D
    public int ObterItemSobMao(Vector3 posicaoMao)
    {
        for(int i=0; i<botoes.Length; i++)
        {
            float dist = Vector3.Distance(posicaoMao, botoes[i].transform.position);
            if (dist < raioDetectavel)
                return i;
        }
        return -1;
    }
}
