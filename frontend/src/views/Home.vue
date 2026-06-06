<template>
  <div class="page-main">
    <section class="hero">
      <div class="hero-bg"></div>
      <svg class="clock-ring" viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="260" cy="260" r="240" stroke="rgba(0,191,255,0.06)" stroke-width="1"/>
        <circle cx="260" cy="260" r="210" stroke="rgba(0,191,255,0.08)" stroke-width="0.5"/>
        <circle cx="260" cy="260" r="180" stroke="rgba(0,191,255,0.12)" stroke-width="1"/>
        <g stroke="rgba(0,191,255,0.3)" stroke-width="1.5">
          <line x1="260" y1="22" x2="260" y2="42"/>
          <line x1="260" y1="478" x2="260" y2="498"/>
          <line x1="22" y1="260" x2="42" y2="260"/>
          <line x1="478" y1="260" x2="498" y2="260"/>
        </g>
        <g stroke="rgba(0,191,255,0.15)" stroke-width="1">
          <line x1="389" y1="47" x2="382" y2="59"/>
          <line x1="131" y1="473" x2="138" y2="461"/>
          <line x1="47" y1="389" x2="59" y2="382"/>
          <line x1="473" y1="131" x2="461" y2="138"/>
          <line x1="473" y1="389" x2="461" y2="382"/>
          <line x1="47" y1="131" x2="59" y2="138"/>
          <line x1="389" y1="473" x2="382" y2="461"/>
          <line x1="131" y1="47" x2="138" y2="59"/>
        </g>
        <rect x="256" y="14" width="8" height="8" fill="rgba(0,229,255,0.6)" transform="rotate(45 260 18)"/>
        <rect x="256" y="494" width="8" height="8" fill="rgba(0,229,255,0.3)" transform="rotate(45 260 498)"/>
        <rect x="14" y="256" width="8" height="8" fill="rgba(0,229,255,0.3)" transform="rotate(45 18 260)"/>
        <rect x="494" y="256" width="8" height="8" fill="rgba(0,229,255,0.3)" transform="rotate(45 498 260)"/>
        <line x1="260" y1="80" x2="260" y2="180" stroke="rgba(0,191,255,0.08)" stroke-width="1"/>
        <line x1="260" y1="340" x2="260" y2="440" stroke="rgba(0,191,255,0.08)" stroke-width="1"/>
        <line x1="80" y1="260" x2="180" y2="260" stroke="rgba(0,191,255,0.08)" stroke-width="1"/>
        <line x1="340" y1="260" x2="440" y2="260" stroke="rgba(0,191,255,0.08)" stroke-width="1"/>
        <circle cx="260" cy="260" r="4" fill="rgba(0,229,255,0.5)"/>
        <circle cx="260" cy="260" r="12" stroke="rgba(0,191,255,0.2)" stroke-width="1" fill="none"/>
      </svg>

      <div class="hero-content">
        <p class="hero-eyebrow">Atlus × Sega · 2024</p>
        <h1 class="hero-title">PERSONA<br><span>3</span> RELOAD</h1>
        <p class="hero-subtitle-latin">Memento Mori — Remember, You Will Die.</p>
        <p class="hero-copy">
          Time never waits.<br>
          It delivers all equally to the same end.<br>
          You were destined to meet this fate.
        </p>
        <div class="hero-buttons">
          <router-link to="/about" class="btn-primary">about nc</router-link>
          <a href="/resume.docx" class="btn-secondary" target="_blank" rel="noopener">CV</a>
        </div>
      </div>
    </section>

    <div class="divider">
      <div class="divider-line"></div>
      <div class="divider-diamond"></div>
      <div class="divider-line"></div>
      <div class="divider-diamond"></div>
      <div class="divider-line"></div>
    </div>

    <div class="music-wrap">
      <div class="disc" :class="{ rotate: true, pause: audioPaused }">
        <img src="/music.png" alt="cover" />
      </div>
      <audio ref="audioEl" controls loop @play="audioPaused = false" @pause="audioPaused = true">
        <source src="/ColorYourNight.mp3" type="audio/mpeg" />
      </audio>
    </div>

    <section id="direction" class="features fade-in">
      <div class="section-header">
        <p class="section-label">RESEARCH DIRECTION</p>
        <h2 class="section-title">研究方向</h2>
      </div>
      <div class="features-grid">
        <div v-for="f in features" :key="f.num" class="feature-card">
          <div class="feature-number">{{ f.num }}</div>
          <p class="feature-title">{{ f.title }}</p>
          <p class="feature-desc">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <section id="career" class="personas fade-in">
      <div class="personas-inner">
        <div class="section-header">
          <p class="section-label">CAREER</p>
          <h2 class="section-title">事业</h2>
        </div>
        <div class="persona-list">
          <router-link v-for="p in careerCards" :key="p.path" :to="p.path" class="persona-link">
            <div class="persona-card" :class="p.color">
              <p class="persona-arcana">{{ p.arcana }}</p>
              <p class="persona-name">{{ p.name }}</p>
              <p class="persona-role">{{ p.role }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <section id="life" class="personas fade-in">
      <div class="personas-inner">
        <div class="section-header">
          <p class="section-label">LIFE</p>
          <h2 class="section-title">生活</h2>
        </div>
        <div class="persona-list">
          <router-link v-for="p in lifeCards" :key="p.path" :to="p.path" class="persona-link">
            <div class="persona-card" :class="p.color">
              <p class="persona-arcana">{{ p.arcana }}</p>
              <p class="persona-name">{{ p.name }}</p>
              <p class="persona-role">{{ p.role }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <section class="quote-section fade-in">
      <div class="quote-bg"></div>
      <p class="quote-text">
        "现在，你们要不要来一起走？<br>
        不管是逃避，还是面对……"
      </p>
      <p class="quote-attr">— 伊吉 · P3 Reload</p>
    </section>

    <footer>
      <div class="footer-logo">Persona 3 Reload · SEGA</div>
      <div class="footer-copy">© ATLUS © SEGA. All rights reserved.</div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFadeIn } from '../composables/useFadeIn.js'

useFadeIn()

const audioPaused = ref(false)

const features = [
  { num: '01', title: '计算机体系结构', desc: '是软件与硬件之间的接口，定义了计算机的功能特性、指令集、寄存器组织及存储器模型。' },
  { num: '02', title: '计算机基础架构', desc: '主要基于冯·诺依曼结构，由CPU（运算器、控制器）、存储器、输入设备和输出设备五大核心部件组成。' },
  { num: '03', title: '资源解耦', desc: '把「硬件实体、系统、应用、算力、存储、网络」从绑定死的关系里拆开，各自独立、可以单独调度、复用、替换、扩容，互不强依赖。' },
  { num: '04', title: '云计算', desc: '无需拥有和维护物理数据中心，只需为实际使用的资源付费，具有高扩展性、低成本和弹性。' },
  { num: '05', title: '分布式系统', desc: '将多个独立节点通过网络连接协同工作以解决单机算力瓶颈' },
]

const careerCards = [
  { path: '/career/papers', arcana: 'The Fool', name: 'Makoto Yuki', role: '论文', color: 'pc-blue' },
  { path: '/career/projects', arcana: 'The Priestess', name: 'Yukari Takeba', role: '项目', color: 'pc-green' },
  { path: '/career/technology', arcana: 'The Emperor', name: 'Akihiko Sanada', role: '技术', color: 'pc-gold' },
  { path: '/career/investment', arcana: 'The Fortune', name: 'Fuuka Yamagishi', role: '投资', color: 'pc-teal' },
]

const lifeCards = [
  { path: '/life/art', arcana: 'The Chariot', name: 'Junpei Iori', role: '艺术', color: 'pc-red' },
  { path: '/life/travel', arcana: 'The Emperor', name: 'Akihiko Sanada', role: '旅行', color: 'pc-gold' },
  { path: '/life/story', arcana: 'The Moon', name: 'Shinjiro Aragaki', role: '故事', color: 'pc-purple' },
  { path: '/life/thoughts', arcana: 'The Fortune', name: 'Fuuka Yamagishi', role: '思考', color: 'pc-teal' },
]
</script>
