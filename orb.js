/*!
 * olahello · bola de luz · orb.js
 * A bola nasce no ponto do wordmark, enche a tela para o manifesto, vai a dois cantos e sai.
 * Material, o gradiente mestre do manual de cores (luz/manual-cores), em OKLab, gerado pelo mesmo motor.
 * Onda, a simulação do off+brand (ob.2026.index.23.js) portada para WebGL puro, sem Three.js.
 * Coreografia, a opção 2 do storyboard (README da pasta), com GSAP ScrollTrigger em scrub.
 * Precisa de GSAP 3 e ScrollTrigger na página. Lenis é opcional.
 */
(function () {
  'use strict';

  /* MATERIAL:INICIO, gerado por _scripts/material.py, não editar à mão */
  var MATERIAL = {"cores_oklab":{"white":[1.0,0.0,0.0],"chao":[0.845222,0.0,0.0],"line":[0.935727,-0.001854,-0.008984],"menta_nevoa":[0.924681,-0.038421,-0.009408],"hr":[0.626646,0.210406,0.116814],"nuc":[0.631863,0.231614,0.085323],"fu":[0.641584,0.255388,0.030607],"r1":[0.719931,0.174402,0.020776],"r2":[0.809608,0.10769,0.012735],"r3":[0.890894,0.056939,0.007531],"bloom":[0.946252,0.02764,0.003224],"ink":[0.189829,-0.002336,-0.00912],"menta":[0.939643,-0.025495,-0.006256]},"cores_hex":{"hr":"#F8251C","fu":"#FF0072"},"varredura":[[-1.7,"hr"],[-0.8,"hr"],[-0.25,"nuc"],[0.3,"fu"],[0.8,"r1"],[1.3,"r2"],[2.0,"r3"],[2.6,"bloom"]],"geometrias":{"esfera":{"base":[[0,"white"],[0.12,"white"],[0.55,"white"],[1,"white"],[1.004,"white"]],"base_chao":[[0,"chao"],[0.1,"chao"],[0.5,"white"],[1,"white"],[1.004,"white"]],"manchas":[{"cx":0.5,"cy":0.33,"sx":0.72,"sy":0.17,"ang":-4,"amp":1,"plato":1.4,"k_cima":0.8,"curva":1.4,"sweep":true,"cor":null},{"cx":0.3,"cy":1.02,"sx":0.4,"sy":0.14,"ang":0,"amp":0.55,"plato":null,"k_cima":0.7,"curva":0,"sweep":false,"cor":"menta_nevoa"},{"cx":0.72,"cy":1.04,"sx":0.36,"sy":0.13,"ang":0,"amp":0.45,"plato":null,"k_cima":0.7,"curva":0,"sweep":false,"cor":"menta_nevoa"}]},"paisagem":{"base":[[0,"white"],[0.12,"white"],[0.55,"white"],[1,"white"],[1.004,"white"]],"base_chao":[[0,"chao"],[0.12,"chao"],[0.55,"white"],[1,"white"],[1.004,"white"]],"manchas":[{"cx":0.5,"cy":0.28,"sx":0.9,"sy":0.165,"ang":-2,"amp":1,"plato":1.4,"k_cima":0.8,"curva":1.7,"sweep":true,"cor":null},{"cx":1.0,"cy":1.06,"sx":0.55,"sy":0.22,"ang":0,"amp":0.5,"plato":null,"k_cima":0.7,"curva":0,"sweep":false,"cor":"menta_nevoa"},{"cx":0.0,"cy":1.08,"sx":0.45,"sy":0.18,"ang":0,"amp":0.35,"plato":null,"k_cima":0.7,"curva":0,"sweep":false,"cor":"menta_nevoa"}]},"alto":{"base":[[0,"white"],[0.12,"white"],[0.55,"white"],[1,"white"],[1.004,"white"]],"base_chao":[[0,"chao"],[0.16,"chao"],[0.52,"white"],[0.9,"white"],[1,"line"]],"manchas":[{"cx":0.5,"cy":0.36,"sx":0.62,"sy":0.17,"ang":-3,"amp":1,"plato":1.3,"k_cima":0.85,"curva":1.5,"sweep":true,"cor":null},{"cx":-0.02,"cy":1.03,"sx":0.34,"sy":0.2,"ang":0,"amp":0.55,"plato":null,"k_cima":0.7,"curva":0,"sweep":false,"cor":"menta_nevoa"},{"cx":1.02,"cy":1.03,"sx":0.34,"sy":0.2,"ang":0,"amp":0.55,"plato":null,"k_cima":0.7,"curva":0,"sweep":false,"cor":"menta_nevoa"}]}},"oklab_m2_inv":[[1.0,0.396338,0.215804],[1.0,-0.105561,-0.063854],[1.0,-0.089484,-1.291486]],"oklab_m1_inv":[[4.076742,-3.307712,0.23097],[-1.268438,2.609757,-0.341319],[-0.004196,-0.703419,1.707615]]};
  /* MATERIAL:FIM */

  // ---------- parâmetros, o painel do index.html mexe aqui ----------
  var P = {
    vida: 1,          // velocidade do tempo de tudo que é vivo
    fluxo: 0.024,     // deformação do domínio, na unidade do motor (gerar_gradientes.py usa 0,03)
    fluxoEscala: 1.4, // células de ruído por lado do quadro
    respira: 1,       // quanto a cúpula respira
    giro: 8,          // graus de giro do material na bola pequena, ida e volta
    onda: 1.5,        // refração da onda
    sombra: 0.1,      // luz da onda em L do OKLab
    brilho: 0.18,     // reflexo da onda
    aro: 0.12,        // claridade na borda da bola pequena
    curvatura: 0.6,   // quanto o material dobra na esfera
    grao: 1,          // vezes o desvio de L de 0,004 do manual
    gotas: 200,       // ms entre gotas aleatórias, 0 desliga
    mouse: true,      // gota onde o ponteiro passa
    chao: 2,          // 2 cinza chão na bola e na tela, como o master e a D7 (recomendado, README §6 A). 1 só na tela cheia. 0 branco
    dpr: 1.5,         // teto de densidade de pixel do canvas
    plano: false,     // modo de conferência, sem dobra, luz, grão nem pontilhado
    kFixo: null,      // conferência, força a geometria (0 bola, 1 tela)
    aneis: false,     // os dois contornos do off+brand, a 1,2 e 0,9 do diâmetro, desligados por padrão (README §6 item 11)
    medir: false,     // conferência, guarda o tempo de cada quadro
    opcaoPadrao: 1,   // opção do storyboard no desktop, 1 escolhida pelo Rodrigo em 27/10/2026 (decisão 153), no lugar da 2 (decisão 148). ?opcao=1 ou ?opcao=2 vencem este padrão
    ponto: null,      // gradiente do ponto do logo no nascimento, {stops: [hex...], vertical}. Nulo é o oficial, Heat Red a Fuchsia na horizontal
    estadoFixo: null  // conferência, força posição e tamanho da bola {x, y, D, alfa, nasce}
  };

  // ---------- coreografia, do _scripts/storyboard.py ----------
  var T = {
    acende: [0.044, 0.077], banner: [0.044, 0.121], zoom: [0.044, 0.704], ponto: 0.682,
    linhas: [[0.715, 0.825], [0.759, 0.869], [0.803, 0.913]], saiTexto: [1.320, 1.386]
  };
  var OPC = {
    desktop: { pino: 1.8, fim: 3.368,
      passos: [['canto1', 1.386, 1.800, 'power2.inOut'], ['canto2', 1.800, 2.800, 'power2.inOut'], ['sai', 2.800, 3.368, 'power1.out']],
      alvos: { canto1: [25, 18, 1], canto2: [40, -36, 0.5], sai: [60, -62, 0] } },
    // opção 1 do storyboard no desktop, tudo dentro da abertura, padrão desde a decisão 153. CANTOS ('1', 1280) do storyboard.py. A desktop acima é a opção 2 (?opcao=2)
    desktop1: { pino: 2.2, fim: 2.200,
      passos: [['canto1', 1.386, 1.760, 'power2.inOut'], ['canto2', 1.760, 2.046, 'power2.inOut'], ['sai', 2.046, 2.200, 'power1.out']],
      alvos: { canto1: [-25, 18, 1], canto2: [40, -36, 0.5], sai: [60, -62, 0] } },
    celular: { pino: 2.2, fim: 2.200,
      passos: [['canto1', 1.386, 1.760, 'power2.inOut'], ['canto2', 1.760, 2.046, 'power2.inOut'], ['sai', 2.046, 2.200, 'power1.out']],
      alvos: { canto1: [-30, 30, 1], canto2: [45, -38, 0.711], sai: [70, -60, 0] } }
  };
  var R_TXT = 0.30;

  // ---------- cor ----------
  function srgbLin(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function hexRgb(h) { h = h.replace('#', ''); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16) / 255; }); }

  // ---------- shaders ----------
  var VERT = 'attribute vec2 aPos; varying vec2 vUv; void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }';

  var SNOISE = [
    'vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}',
    'vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}',
    'vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}',
    'vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}',
    'float snoise(vec3 v){',
    ' const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);',
    ' vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);',
    ' vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);',
    ' vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy; i=mod289(i);',
    ' vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));',
    ' float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx; vec4 j=p-49.0*floor(p*ns.z*ns.z);',
    ' vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_); vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);',
    ' vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw); vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));',
    ' vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;',
    ' vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);',
    ' vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3))); p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;',
    ' vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;',
    ' return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}'
  ].join('\n');

  // Gotas e ruído, a "interactionMaterial" do off+brand
  var F_TOQUE = [
    'precision highp float;', SNOISE,
    'uniform sampler2D uTex; uniform vec2 uCentro; uniform vec2 uCentro2; uniform float uRaio; uniform float uForca;',
    'uniform float uTempo; uniform float uRuidoVel; uniform float uRuidoAmp; uniform float uRuidoFreq; uniform float uApertado;',
    'varying vec2 vUv;',
    'void main(){',
    ' vec4 d=texture2D(uTex,vUv);',
    ' float g=max(0.0,1.0-length(uCentro-vUv)/uRaio); g=0.5-cos(g*3.14159265)*0.5;',
    ' d.r+=(uApertado>0.5?-1.0:1.0)*g*uForca;',
    ' float g2=max(0.0,1.0-length(uCentro2-vUv)/uRaio); g2=0.5-cos(g2*3.14159265)*0.5; d.r+=g2*uForca;',
    ' d.r+=snoise(vec3(vUv,uTempo*uRuidoVel)*uRuidoFreq)*uRuidoAmp;',
    ' gl_FragColor=d;}'
  ].join('\n');

  // Passo da onda, a "simulationMaterial" do off+brand, amortecimento 0,995
  var F_ONDA = [
    'precision highp float;',
    'uniform sampler2D uTex; uniform vec2 uTam; varying vec2 vUv;',
    'void main(){',
    ' vec4 d=texture2D(uTex,vUv); vec2 dx=vec2(1.0/uTam.x,0.0); vec2 dy=vec2(0.0,1.0/uTam.y);',
    ' float m=(texture2D(uTex,vUv-dx).r+texture2D(uTex,vUv-dy).r+texture2D(uTex,vUv+dx).r+texture2D(uTex,vUv+dy).r)*0.25;',
    ' d.g+=(m-d.r)*2.0; d.g*=0.995; d.r+=d.g; d.r*=0.995;',
    ' gl_FragColor=d;}'
  ].join('\n');

  // O fluxo, a deformação do domínio, numa textura de 128 px por quadro. O ruído é de baixa frequência, então 128 amostras
  // por lado bastam, e a bola lê uma vez por pixel em vez de calcular dois ruídos simplex na tela inteira
  var F_FLUXO = [
    'precision highp float;', SNOISE,
    'uniform vec2 uFS; uniform float uT; uniform float uWarpFreq; varying vec2 vUv;',
    'void main(){ float lado=min(uFS.x,uFS.y); vec2 pl=vUv*uFS/lado*uWarpFreq;',
    ' float nu=snoise(vec3(pl,uT*0.06)); float nv=snoise(vec3(pl+vec2(17.3,-9.1),uT*0.06+4.0));',
    ' gl_FragColor=vec4(clamp(nu*0.5+0.5,0.0,1.0),clamp(nv*0.5+0.5,0.0,1.0),0.0,1.0);}'
  ].join('\n');

  // A bola. O campo é o campo() do gerar_gradientes.py linha a linha, em OKLab.
  var F_BOLA = [
    'precision highp float;',
    'uniform vec2 uRes; uniform vec2 uC; uniform float uR; uniform float uAlfa;',
    'uniform vec4 uF; uniform float uK; uniform float uT; uniform float uWarp; uniform float uWarpFreq; uniform float uGiro;',
    'uniform float uCurv; uniform float uAro; uniform float uBrilho; uniform float uSombra; uniform float uOnda;',
    'uniform float uGrao; uniform float uPlano; uniform float uNasce; uniform sampler2D uPontoTex; uniform float uPontoN; uniform float uPontoV; uniform vec3 uLuz;',
    'uniform sampler2D uSim; uniform float uSimOn; uniform vec2 uSimPasso; uniform sampler2D uFluxo;',
    'uniform float uBP[5]; uniform vec3 uBC[5];',
    'uniform vec4 uM0[3]; uniform vec4 uM1[3]; uniform vec4 uM2[3]; uniform vec3 uMC[3];',
    'uniform float uSP[8]; uniform vec3 uSC[8];',
    'uniform vec3 uBranco; uniform mat3 uM2i; uniform mat3 uM1i;',
    'float sst(float t){ t=clamp(t,0.0,1.0); return t*t*(3.0-2.0*t); }',
    'vec3 baseCor(float v){ vec3 o=uBC[0];',
    ' for(int i=0;i<4;i++){ if(v>=uBP[i]){ o=mix(uBC[i],uBC[i+1],sst((v-uBP[i])/max(uBP[i+1]-uBP[i],1e-4))); } } return o; }',
    'vec3 varre(float s){ vec3 o=uSC[0];',
    ' for(int i=0;i<7;i++){ if(s>=uSP[i]){ o=mix(uSC[i],uSC[i+1],sst((s-uSP[i])/(uSP[i+1]-uSP[i]))); } } return o; }',
    'vec3 campo(vec2 uv, vec2 wh){',
    ' float lado=min(wh.x,wh.y); vec3 lab=baseCor(uv.y);',
    ' for(int i=0;i<3;i++){',
    '  vec4 a=uM0[i]; vec4 b=uM1[i]; vec4 c=uM2[i];',
    '  vec2 d=vec2((uv.x-a.x)*wh.x/lado,(uv.y-a.y)*wh.y/lado);',
    '  float x=d.x*b.x+d.y*b.y; float y=-d.x*b.y+d.y*b.x; float s=y/a.w; float sv=s;',
    '  if(c.x>-50.0){ float pe=c.x-c.z*(x/a.z)*(x/a.z); float off=max(0.0,-pe)/c.y; sv=s<0.0?max(0.0,-s-pe)/c.y:sqrt(s*s+off*off); }',
    '  float r=sqrt((x/a.z)*(x/a.z)+sv*sv); float amp=b.z*exp(-r*r*0.5);',
    '  vec3 cor=b.w>0.5?varre(s):uMC[i]; lab=lab*(1.0-amp)+cor*amp; }',
    ' return lab; }',
    'vec3 okLin(vec3 lab){ vec3 lms=uM2i*lab; lms=lms*lms*lms; return uM1i*lms; }',
    'bool dentro(vec3 c){ return all(greaterThanEqual(c,vec3(-1e-5))) && all(lessThanEqual(c,vec3(1.0+1e-5))); }',
    // fora do sRGB, o croma desce com L e matiz fixos, como o CSS Color 4 e o material.py
    'vec3 mapear(vec3 lab){ vec3 c=okLin(lab); if(dentro(c)) return c; float lo=0.0; float hi=1.0;',
    ' for(int i=0;i<8;i++){ float m=(lo+hi)*0.5; if(dentro(okLin(vec3(lab.x,lab.yz*m)))) lo=m; else hi=m; }',
    ' return clamp(okLin(vec3(lab.x,lab.yz*lo)),0.0,1.0); }',
    'vec3 enc(vec3 c){ return mix(c*12.92, 1.055*pow(c,vec3(1.0/2.4))-0.055, step(vec3(0.0031308),c)); }',
    'float hash(vec2 p){ vec3 p3=fract(vec3(p.xyx)*0.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }',
    'void main(){',
    ' vec2 p=vec2(gl_FragCoord.x, uRes.y-gl_FragCoord.y);',
    ' vec2 d=p-uC; float dist=length(d);',
    ' float alfa=clamp(uR-dist+0.5,0.0,1.0)*uAlfa; if(alfa<=0.0){ gl_FragColor=vec4(0.0); return; }',
    ' vec2 q=d/max(uR,1.0); float r=min(length(q),1.0);',
    ' float bola=(1.0-uK)*(1.0-uPlano);',
    // giro do material, como o ângulo que vai e volta no off+brand
    ' float gr=uGiro*bola; vec2 qg=vec2(q.x*cos(gr)-q.y*sin(gr), q.x*sin(gr)+q.y*cos(gr));',
    // o material dobra na esfera, ampliado no meio e apertado na borda
    ' float rr=min(r,0.9999); vec2 qw=rr>1e-5?qg*(asin(rr)*0.63662/rr):qg*0.63662;',
    ' vec2 qe=mix(qg,qw,uCurv*bola);',
    ' vec2 ftl=uF.xy-uF.zw*0.5; vec2 uv=(uC+qe*uR-ftl)/uF.zw;',
    // a onda
    ' vec2 gw=vec2(0.0);',
    ' if(uSimOn>0.5){ vec2 su=clamp(uv,0.0,1.0);',
    '  float hx=texture2D(uSim,su+vec2(uSimPasso.x,0.0)).r-texture2D(uSim,su-vec2(uSimPasso.x,0.0)).r;',
    '  float hy=texture2D(uSim,su+vec2(0.0,uSimPasso.y)).r-texture2D(uSim,su-vec2(0.0,uSimPasso.y)).r;',
    '  gw=vec2(hx,hy)/(2.0*uSimPasso.x)*(1.0-uPlano); }',   // inclinação por uv
    ' vec2 uvc=uv+gw*uOnda*0.008;',
    // o fluxo, deformação do domínio animada, na escala do motor
    ' float lado=min(uF.z,uF.w);',
    ' if(uPlano<0.5 && uWarp>0.0){ vec2 fl=(texture2D(uFluxo,clamp(uvc,0.0,1.0)).rg*2.0-1.0)*3.0;',
    '  uvc+=vec2(fl.x*uWarp*lado/uF.z, fl.y*uWarp*lado/uF.w); }',
    ' vec3 lab=campo(uvc,uF.zw);',
    // luz da onda e da esfera, só em L e para o branco, sem mudar o matiz
    ' vec3 ns=normalize(mix(vec3(q.x,-q.y,sqrt(max(0.0,1.0-r*r))),vec3(0.0,0.0,1.0),1.0-bola));',
    ' vec3 n=normalize(ns+vec3(-gw.x,gw.y,0.0)*0.15*uOnda);',
    ' lab.x+=uSombra*(dot(n,uLuz)-dot(ns,uLuz))*(1.0-uPlano);',
    ' float esp=pow(max(dot(reflect(-uLuz,n),vec3(0.0,0.0,1.0)),0.0),28.0)*uBrilho*(1.0-uPlano);',
    ' float aro=pow(smoothstep(0.55,1.0,r),2.0)*uAro*bola;',
    ' lab=mix(lab,uBranco,clamp(esp+aro,0.0,1.0));',
    // grão de tela parado, desvio de L do manual
    ' if(uPlano<0.5){ vec2 f=floor(gl_FragCoord.xy); float g=hash(f)+hash(f+vec2(1.0,0.0))+hash(f+vec2(0.0,1.0))+hash(f+vec2(1.0,1.0))-2.0; lab.x+=g/0.577*0.004*uGrao; }',
    ' vec3 rgb=enc(mapear(lab));',
    // nascimento, o gradiente horizontal do ponto do logo, interpolado em sRGB como o SVG
    // nascimento, o gradiente do ponto do logo, em sRGB como o SVG. O oficial vai na horizontal, as prospecções de cima para baixo
    ' if(uNasce<1.0){ float t=uPontoV>0.5?clamp((p.y-(uC.y-uR))/(2.0*uR),0.0,1.0):clamp((p.x-(uC.x-uR))/(2.0*uR),0.0,1.0);',
    // as paradas ficam numa textura de 16 por 1 px em sRGB, e o filtro linear interpola entre elas, uma leitura só
    '  vec3 pc=texture2D(uPontoTex,vec2((t*(uPontoN-1.0)+0.5)/16.0,0.5)).rgb;',
    '  rgb=mix(pc,rgb,uNasce); }',
    ' if(uPlano<0.5) rgb+=(hash(gl_FragCoord.xy+71.7)-0.5)/255.0;',
    ' gl_FragColor=vec4(clamp(rgb,0.0,1.0)*alfa,alfa);}'
  ].join('\n');

  // ---------- estado ----------
  var gl, cv, isGL2 = false, progs = {}, quad, fbos = [], fluxo = null, simOk = false, simN = 256, rodando = false;
  var tempo = 0, ultimo = 0, acumulado = 0, pausado = false, congelado = null;
  var prox = { acende: 0, z: 0, canto1: 0, canto2: 0, sai: 0 };
  var geo = { W: 0, H: 0, c0: [0, 0], D0: 1, Df: 1, M: 1, Z: [0, 0], base: 1, modo: 'desktop' };
  var ponteiro = { x: -1, y: -1, dentro: false, apertado: false };
  var PONTO = new Uint8Array(64), pontoUsado = null, texPonto = null, PONTO_OFICIAL = { stops: ['#F8251C', '#FF0072'], vertical: false };   // o SVG oficial, Heat Red a Fuchsia
  var gota = null, GOTA = [0, 0], proximaGota = 0, ultimoEstado = null, FRAME = { x: 0, y: 0, w: 1, h: 1 }, ULT = {};
  var el = {};
  var COR = {};

  function ss(a, b, x) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  // ---------- geometria, porta de storyboard.py modelo() ----------
  function medir() {
    var W = window.innerWidth, H = el.pino ? el.pino.clientHeight : window.innerHeight;
    geo.W = W; geo.H = H; geo.modo = W < 768 ? 'celular' : 'desktop';
    var pr = el.pino.getBoundingClientRect(), pt = el.ponto.getBoundingClientRect();
    // centro do ponto em relação ao topo do quadro preso, que fica em 0 enquanto a abertura está presa
    var cx = pt.left + pt.width / 2, cy = pt.top - pr.top + pt.height / 2;
    geo.c0 = [cx - W / 2, cy - H / 2]; geo.D0 = pt.width;
    // caixa do texto do storyboard, 600 por 160 e 343 por 190 [SUPOSIÇÃO], que dá o ritmo do zoom aprovado
    var tw = geo.modo === 'celular' ? 343 : 600, th = geo.modo === 'celular' ? 190 : 160;
    var hd = Math.hypot(W / 2, H / 2), dt = Math.hypot(tw / 2, th / 2);
    geo.Df = 2 * Math.max(hd, dt / R_TXT);
    geo.M = geo.Df / geo.D0;
    geo.Z = [geo.c0[0] * geo.M / (geo.M - 1), geo.c0[1] * geo.M / (geo.M - 1)];
    geo.base = Math.min(0.8 * H, 0.9 * W);
  }

  var EST = { x: 0, y: 0, D: 0, alfa: 0, nasce: 1 };
  function estado() {
    var o = OPC[geo.modo], cx, cy, D;
    if (prox.z < 1) {
      var m = Math.exp(Math.log(geo.M) * prox.z);
      cx = geo.Z[0] + (geo.c0[0] - geo.Z[0]) * m; cy = geo.Z[1] + (geo.c0[1] - geo.Z[1]) * m; D = geo.D0 * m;
    } else {
      cx = 0; cy = 0; D = geo.Df;
      for (var i = 0; i < o.passos.length; i++) {
        var nome = o.passos[i][0], t = prox[nome]; if (t <= 0) break;
        var a = o.alvos[nome];
        cx = lerp(cx, a[0] * geo.W / 100, t); cy = lerp(cy, a[1] * geo.H / 100, t); D = lerp(D, a[2] * geo.base, t);
      }
    }
    EST.x = cx + geo.W / 2; EST.y = cy + geo.H / 2; EST.D = D; EST.alfa = prox.acende;
    EST.nasce = prox.z < 1 ? ss(2 * geo.D0, 4 * geo.D0, D) : 1;
    return EST;
  }

  // ---------- GL ----------
  function compilar(fs) {
    function sh(tipo, src) {
      var s = gl.createShader(tipo); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }
    var p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'aPos'); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    var u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) { var info = gl.getActiveUniform(p, i), nome = info.name.replace(/\[0\]$/, ''); u[nome] = gl.getUniformLocation(p, info.name); }
    return { p: p, u: u };
  }

  function criarFbo8(n) {   // RGBA de 8 bits, que todo WebGL grava
    var tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, n, n, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    var fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { tex: tex, fb: fb, n: n };
  }

  function criarFbo(n) {
    var tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    var tipo, fmt = gl.RGBA, ifmt = gl.RGBA;
    if (isGL2) { tipo = gl.HALF_FLOAT; ifmt = gl.RGBA16F; }
    else { var e = gl.getExtension('OES_texture_half_float'); if (!e) return null; tipo = e.HALF_FLOAT_OES; gl.getExtension('EXT_color_buffer_half_float'); }
    var lin = isGL2 || gl.getExtension('OES_texture_half_float_linear');
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, lin ? gl.LINEAR : gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, lin ? gl.LINEAR : gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, ifmt, n, n, 0, fmt, tipo, null);
    var fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    var ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return ok ? { tex: tex, fb: fb } : null;
  }

  function montarGL() {
    var opts = { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: 'high-performance' };
    gl = cv.getContext('webgl2', opts); isGL2 = !!gl;
    if (!gl) gl = cv.getContext('webgl', opts) || cv.getContext('experimental-webgl', opts);
    if (!gl) return false;
    if (isGL2) { gl.getExtension('EXT_color_buffer_float'); gl.getExtension('EXT_color_buffer_half_float'); }
    progs.toque = compilar(F_TOQUE); progs.onda = compilar(F_ONDA); progs.bola = compilar(F_BOLA); progs.fluxo = compilar(F_FLUXO);
    fluxo = criarFbo8(128);
    quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    simN = window.innerWidth < 768 ? 128 : 256;
    var a = criarFbo(simN), b = a && criarFbo(simN);
    simOk = !!(a && b); fbos = simOk ? [a, b] : [];
    // uniforms fixos da bola
    gl.useProgram(progs.bola.p);
    var u = progs.bola.u, M = MATERIAL;
    var m2 = [].concat.apply([], [0, 1, 2].map(function (c) { return [0, 1, 2].map(function (r) { return M.oklab_m2_inv[r][c]; }); }));
    var m1 = [].concat.apply([], [0, 1, 2].map(function (c) { return [0, 1, 2].map(function (r) { return M.oklab_m1_inv[r][c]; }); }));
    gl.uniformMatrix3fv(u.uM2i, false, m2); gl.uniformMatrix3fv(u.uM1i, false, m1);
    gl.uniform1fv(u.uSP, M.varredura.map(function (s) { return s[0]; }));
    gl.uniform3fv(u.uSC, [].concat.apply([], M.varredura.map(function (s) { return M.cores_oklab[s[1]]; })));
    gl.uniform3fv(u.uBranco, M.cores_oklab.white);
    gl.uniform1i(u.uSim, 0);
    // textura do gradiente do ponto, 16 por 1 px, filtro linear
    texPonto = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texPonto);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 16, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(64));
    gl.uniform1i(u.uPontoTex, 1); gl.uniform1i(u.uFluxo, 2); pontoUsado = null;
    return true;
  }

  function redimensionar() {
    if (!cv) return;
    var dpr = Math.min(window.devicePixelRatio || 1, P.dpr);
    var w = Math.round(cv.clientWidth * dpr), h = Math.round(cv.clientHeight * dpr);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  }

  // geometria do material, interpolada da bola para a tela
  // geometria do material, interpolada da bola para a tela. Buffers fixos, para não criar lixo a cada quadro
  var GEO = { BP: new Float32Array(5), BC: new Float32Array(15), M0: new Float32Array(12), M1: new Float32Array(12), M2: new Float32Array(12), MC: new Float32Array(9) };
  var CAMPOS = ['cx', 'cy', 'sx', 'sy', 'ang', 'amp', 'plato', 'k_cima', 'curva'], V = {};
  function geometria(k) {
    var G = MATERIAL.geometrias, a = G.esfera, b = G[geo.modo === 'celular' ? 'alto' : 'paisagem'];
    // chão 0, branco em tudo. 1, cinza chão só na tela cheia. 2, cinza chão na bola e na tela cheia, o master inteiro
    var ch = P.chao === true ? 2 : (+P.chao || 0), L = MATERIAL.cores_oklab;
    var ba = a[ch === 2 ? 'base_chao' : 'base'], bb = b[ch >= 1 ? 'base_chao' : 'base'];
    for (var i = 0; i < 5; i++) {
      GEO.BP[i] = lerp(ba[i][0], bb[i][0], k);
      var ca = L[ba[i][1]], cb = L[bb[i][1]];
      for (var c = 0; c < 3; c++) GEO.BC[i * 3 + c] = lerp(ca[c], cb[c], k);
    }
    var t = tempo, r = P.respira;
    for (var j = 0; j < 3; j++) {
      var ma = a.manchas[j], mb = b.manchas[j];
      for (var n = 0; n < CAMPOS.length; n++) { var nm = CAMPOS[n]; V[nm] = ma[nm] === null ? -100 : lerp(ma[nm], mb[nm], k); }
      if (j === 0) {   // a cúpula respira
        V.cy += r * 0.012 * Math.sin(t * 2 * Math.PI / 9.1);
        V.cx += r * 0.015 * Math.sin(t * 2 * Math.PI / 13.7 + 0.8);
        V.sy *= 1 + r * 0.06 * Math.sin(t * 2 * Math.PI / 7.3 + 1.3);
        V.plato += r * 0.12 * Math.sin(t * 2 * Math.PI / 11.1 + 0.4);
        V.ang += r * 1.5 * Math.sin(t * 2 * Math.PI / 17.9 + 2.1);
      } else {
        V.amp *= 1 + r * 0.15 * Math.sin(t * 2 * Math.PI / (8.3 + j * 2.9) + j);
      }
      var rad = V.ang * Math.PI / 180, o = j * 4;
      GEO.M0[o] = V.cx; GEO.M0[o + 1] = V.cy; GEO.M0[o + 2] = V.sx; GEO.M0[o + 3] = V.sy;
      GEO.M1[o] = Math.cos(rad); GEO.M1[o + 1] = Math.sin(rad); GEO.M1[o + 2] = V.amp; GEO.M1[o + 3] = ma.sweep ? 1 : 0;
      GEO.M2[o] = V.plato; GEO.M2[o + 1] = V.k_cima; GEO.M2[o + 2] = V.curva; GEO.M2[o + 3] = 0;
      var cor = ma.sweep ? L.white : L[ma.cor]; GEO.MC[j * 3] = cor[0]; GEO.MC[j * 3 + 1] = cor[1]; GEO.MC[j * 3 + 2] = cor[2];
    }
    return GEO;
  }

  function passoSim(frame, s) {
    if (!simOk) return;
    var n = simN;
    gl.viewport(0, 0, n, n); gl.disable(gl.SCISSOR_TEST);
    // gotas e ruído: lê fbos[1], grava fbos[0]
    var u = progs.toque.u; gl.useProgram(progs.toque.p);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbos[0].fb); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, fbos[1].tex);
    gl.uniform1i(u.uTex, 0);
    var cx = -1, cy = -1;
    if (P.mouse && ponteiro.dentro && !pausado && congelado === null) {
      var fx = frame.x - frame.w / 2, fy = frame.y - frame.h / 2;
      cx = (ponteiro.x - fx) / frame.w; cy = (ponteiro.y - fy) / frame.h;
    }
    gl.uniform2f(u.uCentro, cx, cy);
    if (gota) { gl.uniform2f(u.uCentro2, gota[0], gota[1]); gota = null; } else gl.uniform2f(u.uCentro2, -1, -1);
    gl.uniform1f(u.uRaio, 0.05); gl.uniform1f(u.uForca, 0.05);
    gl.uniform1f(u.uTempo, tempo); gl.uniform1f(u.uRuidoVel, 0.1); gl.uniform1f(u.uRuidoAmp, pausado ? 0 : 0.005); gl.uniform1f(u.uRuidoFreq, 3);
    gl.uniform1f(u.uApertado, ponteiro.apertado ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    // passo da onda: lê fbos[0], grava fbos[1], com o passo de 2 texels do off+brand
    var v = progs.onda.u; gl.useProgram(progs.onda.p);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbos[1].fb); gl.bindTexture(gl.TEXTURE_2D, fbos[0].tex);
    gl.uniform1i(v.uTex, 0); gl.uniform2f(v.uTam, n / 2, n / 2);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  function desenhar(st) {
    redimensionar();
    var dpr = cv.width / Math.max(cv.clientWidth, 1);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, cv.width, cv.height);
    gl.disable(gl.SCISSOR_TEST); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    var R = st.D / 2;
    if (st.alfa <= 0.001 || R < 0.5) return;
    var W = geo.W, H = geo.H;
    var cobre = Math.max(Math.hypot(st.x, st.y), Math.hypot(W - st.x, st.y), Math.hypot(st.x, H - st.y), Math.hypot(W - st.x, H - st.y));
    var k = P.kFixo !== null ? P.kFixo : ss(0.6, 1.0, R / cobre);
    // quadro do material, da caixa da bola para a tela
    var fw = Math.exp(lerp(Math.log(2 * R), Math.log(W), k)), fh = Math.exp(lerp(Math.log(2 * R), Math.log(H), k));
    var frame = FRAME; frame.x = lerp(st.x, W / 2, k); frame.y = lerp(st.y, H / 2, k); frame.w = fw; frame.h = fh;
    // simulação a 60 passos por segundo, como no off+brand a 60 Hz
    if (simOk && !P.plano) {
      var passos = 0; while (acumulado >= 1 / 60 && passos < 3) { passoSim(frame, st); acumulado -= 1 / 60; passos++; }
      if (acumulado > 0.1) acumulado = 0;
    }
    // o fluxo do quadro, na textura de 128 px
    if (!P.plano && P.fluxo > 0) {
      gl.disable(gl.SCISSOR_TEST); gl.bindFramebuffer(gl.FRAMEBUFFER, fluxo.fb); gl.viewport(0, 0, fluxo.n, fluxo.n);
      var fu = progs.fluxo.u; gl.useProgram(progs.fluxo.p);
      gl.uniform2f(fu.uFS, frame.w, frame.h); gl.uniform1f(fu.uT, tempo); gl.uniform1f(fu.uWarpFreq, P.fluxoEscala);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, cv.width, cv.height);
    // só os pixels da caixa da bola rodam o shader
    var ch = cv.clientHeight;
    var x0 = Math.max(0, Math.floor((st.x - R - 2) * dpr)), x1 = Math.min(cv.width, Math.ceil((st.x + R + 2) * dpr));
    var y0 = Math.max(0, Math.floor((ch - st.y - R - 2) * dpr)), y1 = Math.min(cv.height, Math.ceil((ch - st.y + R + 2) * dpr));
    if (x1 <= x0 || y1 <= y0) return;
    gl.enable(gl.SCISSOR_TEST); gl.scissor(x0, y0, x1 - x0, y1 - y0);
    var b = progs.bola, u = b.u; gl.useProgram(b.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, simOk ? fbos[1].tex : null);
    var g = geometria(k);
    gl.uniform1fv(u.uBP, g.BP); gl.uniform3fv(u.uBC, g.BC);
    gl.uniform4fv(u.uM0, g.M0); gl.uniform4fv(u.uM1, g.M1); gl.uniform4fv(u.uM2, g.M2); gl.uniform3fv(u.uMC, g.MC);
    gl.uniform2f(u.uRes, cv.width, cv.height);
    gl.uniform2f(u.uC, st.x * dpr, st.y * dpr); gl.uniform1f(u.uR, R * dpr); gl.uniform1f(u.uAlfa, st.alfa);
    gl.uniform4f(u.uF, frame.x * dpr, frame.y * dpr, frame.w * dpr, frame.h * dpr);
    gl.uniform1f(u.uK, k); gl.uniform1f(u.uT, tempo);
    gl.uniform1f(u.uWarp, P.plano ? 0 : P.fluxo); gl.uniform1f(u.uWarpFreq, P.fluxoEscala);
    gl.uniform1f(u.uGiro, P.giro * Math.PI / 180 * Math.sin(tempo * 2 * Math.PI / 16));
    gl.uniform1f(u.uCurv, P.curvatura); gl.uniform1f(u.uAro, P.aro); gl.uniform1f(u.uBrilho, P.brilho);
    gl.uniform1f(u.uSombra, P.sombra); gl.uniform1f(u.uOnda, P.onda); gl.uniform1f(u.uGrao, P.grao);
    gl.uniform1f(u.uPlano, P.plano ? 1 : 0); gl.uniform1f(u.uNasce, st.nasce);
    var pt = P.ponto || PONTO_OFICIAL;
    if (pt !== pontoUsado) {   // só quando o ponto troca
      pontoUsado = pt; PONTO.fill(0);
      for (var q = 0; q < Math.min(16, pt.stops.length); q++) { var c3 = hexRgb(pt.stops[q]); PONTO[q * 4] = c3[0] * 255; PONTO[q * 4 + 1] = c3[1] * 255; PONTO[q * 4 + 2] = c3[2] * 255; PONTO[q * 4 + 3] = 255; }
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texPonto);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 16, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, PONTO);
      gl.activeTexture(gl.TEXTURE0);
    }
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texPonto);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, fluxo.tex); gl.activeTexture(gl.TEXTURE0);
    gl.uniform1f(u.uPontoN, Math.min(16, pt.stops.length)); gl.uniform1f(u.uPontoV, pt.vertical ? 1 : 0);
    gl.uniform1f(u.uSimOn, simOk && !P.plano ? 1 : 0); gl.uniform2f(u.uSimPasso, 1 / simN, 1 / simN);
    // a luz anda de um lado ao outro do alto, como o lightDirection do off+brand
    var la = Math.PI / 2 + 1.07 * Math.sin(tempo * 2 * Math.PI / 7.2);
    var lx = Math.cos(la) * 0.6, ly = Math.sin(la) * 0.6, ln = Math.hypot(lx, ly, 1);
    gl.uniform3f(u.uLuz, lx / ln, ly / ln, 1 / ln);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disable(gl.SCISSOR_TEST);
    ULT.st = st; ULT.k = k; ULT.frame = frame; ULT.dpr = dpr; ultimoEstado = ULT;
  }

  // medição, tempo de JS por quadro e tempo de GPU pelo EXT_disjoint_timer_query_webgl2 quando o navegador expõe
  var med = { js: [], gpu: [], q: [], ext: null };
  function medirGpuIni() {
    if (!P.medir || !isGL2) return null;
    if (med.ext === null) med.ext = gl.getExtension('EXT_disjoint_timer_query_webgl2') || false;
    if (!med.ext) return null;
    var q = gl.createQuery(); gl.beginQuery(med.ext.TIME_ELAPSED_EXT, q); return q;
  }
  function medirGpuFim(q) {
    if (!q) return; gl.endQuery(med.ext.TIME_ELAPSED_EXT); med.q.push(q);
    med.q = med.q.filter(function (x) {
      if (!gl.getQueryParameter(x, gl.QUERY_RESULT_AVAILABLE)) return true;
      if (!gl.getParameter(med.ext.GPU_DISJOINT_EXT)) med.gpu.push(gl.getQueryParameter(x, gl.QUERY_RESULT) / 1e6);
      gl.deleteQuery(x); return false;
    });
  }
  function quadro(agora) {
    var t0 = performance.now(), qg = gl && !gl.isContextLost() ? medirGpuIni() : null;
    quadroReal(agora);
    medirGpuFim(qg);
    if (P.medir) med.js.push(performance.now() - t0);
  }
  function quadroReal(agora) {
    agora = agora || performance.now();
    var dt = ultimo ? Math.min(0.1, (agora - ultimo) / 1000) : 0; ultimo = agora;
    if (congelado !== null) tempo = congelado;
    else if (!pausado) { tempo += dt * P.vida; acumulado += dt; }
    if (!pausado && congelado === null && P.gotas > 0 && agora > proximaGota) {
      GOTA[0] = 0.15 + Math.random() * 0.7; GOTA[1] = 0.15 + Math.random() * 0.7; gota = GOTA; proximaGota = agora + P.gotas;
    }
    var st = P.estadoFixo || estado();
    if (gl && !gl.isContextLost()) desenhar(st); else reserva(st);
    aneis(st);
  }

  // ---------- anéis, chave do painel ----------
  var anel = null;
  function aneis(st) {
    if (!P.aneis) { if (anel) anel.forEach(function (a) { a.style.display = 'none'; }); return; }
    if (!anel) anel = [1.2, 0.9].map(function (f) {
      var a = document.createElement('div'); a.setAttribute('aria-hidden', 'true'); a.dataset.f = f;
      a.style.cssText = 'position:fixed;left:0;top:0;width:100px;height:100px;border-radius:50%;border:1px solid rgba(17,20,24,.35);transform-origin:0 0;pointer-events:none;z-index:1';
      document.body.appendChild(a); return a;
    });
    anel.forEach(function (a) {
      var D = st.D * parseFloat(a.dataset.f), R = D / 2;
      a.style.display = st.alfa > 0.01 && D > 1 ? 'block' : 'none'; a.style.opacity = st.alfa;
      a.style.width = a.style.height = D.toFixed(1) + 'px'; a.style.transform = 'translate(' + (st.x - R).toFixed(1) + 'px,' + (st.y - R).toFixed(1) + 'px)';
    });
  }

  // ---------- sem WebGL, o disco do material, levado pela mesma linha do tempo ----------
  function reserva(st) {
    if (!el.reserva) return;
    var R = st.D / 2, W = geo.W, H = geo.H;
    var cobre = Math.max(Math.hypot(st.x, st.y), Math.hypot(W - st.x, st.y), Math.hypot(st.x, H - st.y), Math.hypot(W - st.x, H - st.y));
    var k = R > 0 ? ss(0.6, 1.0, R / cobre) : 0;
    el.reserva.style.opacity = st.alfa.toFixed(3);
    el.reservaBola.style.transform = 'translate(' + (st.x - R).toFixed(1) + 'px,' + (st.y - R).toFixed(1) + 'px) scale(' + (st.D / 100).toFixed(4) + ')';
    el.reservaTela.style.opacity = k.toFixed(3); el.reservaBola.style.opacity = (1 - k).toFixed(3);
    var ch = P.chao === true ? 2 : (+P.chao || 0);
    if (el.reserva.dataset.chao !== String(ch)) {   // o chão do master na tela cheia e no disco, como no WebGL
      el.reserva.dataset.chao = ch;
      el.reservaTela.style.backgroundColor = '#FFFFFF';
      el.reservaTela.style.backgroundImage = ch >= 1 ? 'linear-gradient(180deg, #CCCCCC 0%, #CCCCCC 12%, #FFFFFF 55%, #FFFFFF 100%)' : 'none';
      el.reservaBola.classList.toggle('orb-reserva-bola--chao', ch === 2);
    }
  }

  // ---------- linhas do tempo ----------
  function coreografia() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap || !ST) { console.warn('orb.js: GSAP e ScrollTrigger não carregaram'); return; }
    gsap.registerPlugin(ST);
    var mm = gsap.matchMedia();
    function montar(modo) {
      var o = OPC[modo], H = function () { return el.pino.clientHeight; };
      el.abre.style.height = ((o.pino + 1) * 100) + 'vh';
      if (el.paragrafo) el.paragrafo.style.minHeight = modo === 'desktop' ? '100vh' : '';
      var st = function (fim) { return { trigger: el.abre, start: 'top top', end: function () { return '+=' + fim * H(); }, scrub: true, invalidateOnRefresh: true }; };
      // a bola, uma linha do tempo com o tempo em telas de rolagem
      var tb = gsap.timeline({ scrollTrigger: st(o.fim), defaults: { ease: 'none' } });
      tb.fromTo(prox, { acende: 0 }, { acende: 1, duration: T.acende[1] - T.acende[0] }, T.acende[0]);
      tb.fromTo(prox, { z: 0 }, { z: 1, duration: T.zoom[1] - T.zoom[0] }, T.zoom[0]);
      o.passos.forEach(function (p) { var v = {}; v[p[0]] = 1; v.duration = p[2] - p[1]; v.ease = p[3]; var de = {}; de[p[0]] = 0; tb.fromTo(prox, de, v, p[1]); });
      tb.set({}, {}, o.fim);
      // o banner sai antes de a bola tocar nele
      var tbn = gsap.timeline({ scrollTrigger: st(o.fim) });
      tbn.fromTo(el.sai, { autoAlpha: 1 }, { autoAlpha: 0, duration: T.banner[1] - T.banner[0], ease: 'none' }, T.banner[0]);
      tbn.set(el.ponto, { visibility: 'hidden' }, T.ponto);
      tbn.set({}, {}, o.fim);
      // o manifesto, linha a linha
      el.linhas.forEach(function (ln, i) {
        var tl = gsap.timeline({ scrollTrigger: st(o.fim) });
        tl.fromTo(ln, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: T.linhas[i][1] - T.linhas[i][0], ease: 'power2.out' }, T.linhas[i][0]);
        tl.to(ln, { autoAlpha: 0, y: -40, duration: T.saiTexto[1] - T.saiTexto[0], ease: 'power2.in' }, T.saiTexto[0]);
        tl.set({}, {}, o.fim);
      });
      return function () { el.abre.style.height = ''; };
    }
    mm.add('(min-width: 768px)', function () { return montar('desktop'); });
    mm.add('(max-width: 767px)', function () { return montar('celular'); });
    ST.addEventListener('refresh', medir);
  }

  // ---------- pausa, um botão só (WCAG 2.2.2) ----------
  function pausa(b) {
    pausado = b;
    if (el.pausa) { el.pausa.setAttribute('aria-pressed', b ? 'true' : 'false'); el.pausa.textContent = b ? 'Retomar movimento' : 'Pausar movimento'; }
    document.documentElement.classList.toggle('orb-pausado', b);
  }

  // ---------- início ----------
  function iniciar(opcoes) {
    opcoes = opcoes || {};
    if (!MATERIAL) { console.warn('orb.js: material ausente'); return; }
    var $ = function (s) { return document.querySelector(s); };
    // opção do storyboard, 1 por padrão (decisão 153), 2 para comparar com ?opcao=2
    var mo = location.search.match(/[?&]opcao=([12])/);
    var op = opcoes.opcao || (mo ? +mo[1] : P.opcaoPadrao);
    if (op === 1) { OPC.desktop2 = OPC.desktop2 || OPC.desktop; OPC.desktop = OPC.desktop1; }
    P.opcao = op;
    el.abre = $('[data-orb-abre]'); el.pino = $('[data-orb-pino]'); el.ponto = $('[data-orb-ponto]');
    el.sai = Array.prototype.slice.call(document.querySelectorAll('[data-orb-sai]'));
    el.linhas = Array.prototype.slice.call(document.querySelectorAll('[data-orb-linha]'));
    el.manifesto = $('[data-orb-manifesto]'); el.apoio = $('[data-orb-apoio]'); el.paragrafo = $('[data-orb-paragrafo]');
    el.pausa = $('[data-orb-pausa]'); el.reserva = $('[data-orb-reserva]');
    if (el.reserva) { el.reservaBola = el.reserva.querySelector('[data-orb-reserva-bola]'); el.reservaTela = el.reserva.querySelector('[data-orb-reserva-tela]'); }
    cv = $('canvas[data-orb]');
    if (!el.abre || !el.pino || !el.ponto || !cv) { console.warn('orb.js: faltam data-orb-abre, data-orb-pino, data-orb-ponto ou canvas[data-orb]'); return; }
    cv.setAttribute('aria-hidden', 'true');
    medir(); coreografia();
    if (el.pausa) el.pausa.addEventListener('click', function () { pausa(!pausado); });
    window.addEventListener('pointermove', function (e) {
      ponteiro.x = e.clientX; ponteiro.y = e.clientY;
      var u = ultimoEstado; ponteiro.dentro = !!(u && Math.hypot(e.clientX - u.st.x, e.clientY - u.st.y) < u.st.D / 2);
    }, { passive: true });
    window.addEventListener('pointerdown', function () { ponteiro.apertado = true; }, { passive: true });
    window.addEventListener('pointerup', function () { ponteiro.apertado = false; }, { passive: true });
    window.addEventListener('resize', function () { medir(); });
    // o WebGL sobe depois do load, sem disputar o LCP
    var subir = function () {
      var ok = false;
      try { ok = opcoes.semGL ? false : montarGL(); } catch (err) { console.warn('orb.js: WebGL falhou', err); ok = false; gl = null; }
      if (ok) {
        cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); }, false);
        cv.addEventListener('webglcontextrestored', function () { try { montarGL(); } catch (err) { gl = null; if (el.reserva) el.reserva.style.display = ''; } }, false);
        if (el.reserva) el.reserva.style.display = 'none';
        document.documentElement.classList.add('orb-webgl');
      } else { gl = null; cv.style.display = 'none'; if (el.reserva) el.reserva.style.display = ''; }
      if (opcoes.semCiclo) return;
      if (window.gsap) window.gsap.ticker.add(function () { quadro(performance.now()); });
      else { var loop = function (t) { quadro(t); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
    };
    if (opcoes.imediato) subir();
    else if (document.readyState === 'complete') agendar(subir); else window.addEventListener('load', function () { agendar(subir); });
  }
  function agendar(f) { if ('requestIdleCallback' in window) window.requestIdleCallback(f, { timeout: 1200 }); else setTimeout(f, 200); }

  window.OlaOrb = {
    P: P, T: T, OPC: OPC, prox: prox, geo: geo, iniciar: iniciar, medir: medir, estado: estado,
    pausa: pausa, congelar: function (t) { congelado = (t === undefined || t === null) ? null : t; },
    quadro: function () { quadro(performance.now()); }, info: function () { return { gl2: isGL2, sim: simOk, simN: simN, ultimo: ultimoEstado, tempo: tempo }; },
    material: function () { return MATERIAL; },
    // conferência, desenha um quadro e lê a luminância relativa (WCAG) do canvas em cada caixa, em px de CSS
    luminancia: function (caixas) {
      if (!gl) return null;
      quadro(performance.now());
      var dpr = cv.width / cv.clientWidth, ch = cv.clientHeight;
      return caixas.map(function (c) {
        var x = Math.max(0, Math.round(c.x * dpr)), w = Math.max(1, Math.round(c.w * dpr)), h = Math.max(1, Math.round(c.h * dpr));
        var y = Math.max(0, Math.round((ch - c.y - c.h) * dpr)), a = new Uint8Array(w * h * 4);
        gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, a);
        var mn = 1, mx = 0, n = 0, rgbMin = null, rgbMax = null;
        for (var i = 0; i < w * h; i++) {
          var al = a[i * 4 + 3] / 255; if (al < 0.999) continue;   // só onde a bola cobre por inteiro
          var L = 0, k = [0.2126, 0.7152, 0.0722];
          for (var j = 0; j < 3; j++) { var v = a[i * 4 + j] / 255; L += k[j] * (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); }
          if (L < mn) { mn = L; rgbMin = [a[i * 4], a[i * 4 + 1], a[i * 4 + 2]]; } if (L > mx) { mx = L; rgbMax = [a[i * 4], a[i * 4 + 1], a[i * 4 + 2]]; } n++;
        }
        return { min: mn, max: mx, rgbMin: rgbMin, rgbMax: rgbMax, pixels: n, total: w * h };
      });
    },
    medidas: function (limpar) { var r = { js: med.js.slice(), gpu: med.gpu.slice(), gpuExt: !!med.ext }; if (limpar) { med.js = []; med.gpu = []; } return r; },
    lerSim: function () {   // conferência, altura da onda: mínimo, máximo, desvio e inclinação média por uv
      if (!simOk || !isGL2) return null;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbos[1].fb); var n = simN, a = new Float32Array(n * n * 4);
      gl.readPixels(0, 0, n, n, gl.RGBA, gl.FLOAT, a); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      var mn = 1e9, mx = -1e9, s1 = 0, s2 = 0, inc = 0;
      for (var i = 0; i < n * n; i++) { var h = a[i * 4]; mn = Math.min(mn, h); mx = Math.max(mx, h); s1 += h; s2 += h * h; if (i % n < n - 2) inc += Math.abs(a[(i + 2) * 4] - h) * n / 2; }
      var m = s1 / (n * n); return { min: mn, max: mx, desvio: Math.sqrt(s2 / (n * n) - m * m), inclinacao: inc / (n * n) };
    }
  };
})();
