#carregar biblioteca
library(reshape2)
library(ggplot2)

#importar tabela
tabela <- read.csv("contagem.csv")

#excluir primeira coluna
tabela <- tabela[-1]
colnames(tabela)

#excluir ultima coluna
tabela <- tabela[-ncol(tabela)]

#calculo da area
tabela$ignea <- ((tabela$X1 * 900) / 10000 ) / 1000000
tabela$metamorfica <- ((tabela$X2 * 900) / 10000 ) / 1000000
tabela$sedimentar <- ((tabela$X3 * 900) / 10000 ) / 1000000

#excluir colunas
tabela <- tabela[-1:-3]        #os : servem pra indicar um intervalo

tabela[is.na(tabela)] <- 0     # tirar os valores NA existentes na tabela
#Calculo da proporção das rochas sedimentares
tabela$porcentagem_sed <- tabela$sedimentar / (tabela$ignea + tabela$metamorfica + tabela$sedimentar)

#girar a tabela
tabela <- melt(tabela, id.vars = c("mapb","porcentagem_sed"))  #id.vars serve para definir a coluna ID

#plotar dados no grafico
ggplot(tabela, aes(y=value, x=as.factor(reorder(mapb,porcentagem_sed)), fill=variable)) + 
  geom_bar(position="fill", stat="identity", alpha = 0.9) + 
  scale_fill_manual("legenda",
                    values = c("red","green","blue"),     #definir cores do grafico
                    labels = c("Ígnea","Metamórfica", "Sedimentar")) +  #definir os valores da legenda
  xlab("Regiões")+    #colocar nome no eixo X
  ylab("Proporção")+  #colocar nome no eixo Y
  ggtitle("Grafico de Proporção de Rochas por Região")+  #colocar titulo no grafico
  theme_bw()         # Theme tem varios modelos de ajustar a visualização do grafico
