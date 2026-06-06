<template>
  <div class="page-main">
    <section class="hero hero-sm">
      <div class="hero-bg"></div>
      <div class="hero-content fade-in">
        <h1 class="hero-title">关于聂畅</h1>
      </div>
    </section>

    <div class="content fade-in">
      <h2>我是谁</h2>
      <p>你好！我是聂畅，2005年出生在湖南娄底，在娄底生活了18年，在北京读了三年的书。
        在2011年到2012年，我就读于长沙华夏实验学校，2012年以后在娄底市第三小学完成了小学学业。
        之后在娄底市第三中学完成了6年的中学学业。2023年，入学北京交通大学
        数学与统计学院，主修数据科学专业，2027年完成本科学业。</p>
      <h2>我的兴趣研究方向</h2>
      <p>在北京交通大学数据科学专业，我学习统计和机器学习方向的专业课，对数据挖掘和深度学习有一定的兴趣。
        我未来将会专注在分布式系统和计算机体系结构，特别是资源解耦方向(Disaggregation)。</p>
      <h2>兴趣爱好</h2>
      <p>我从5岁开始学习钢琴，中间断断续续摸了十多年。我最喜欢的作曲家是奥地利音乐家
        <a href="https://zh.wikipedia.org/zh-cn/%E5%BC%97%E6%9C%97%E8%8C%A8%C2%B7%E8%88%92%E4%BC%AF%E7%89%B9" target="_blank" rel="noopener">弗朗茨·舒伯特</a>
        和俄国作曲家
        <a href="https://zh.wikipedia.org/zh-cn/%E8%B0%A2%E5%B0%94%E7%9B%96%C2%B7%E6%8B%89%E8%B5%AB%E7%8E%9B%E5%B0%BC%E8%AF%BA%E5%A4%AB" target="_blank" rel="noopener">谢尔盖·拉赫玛尼诺夫</a>，
        我也特别喜欢波兰作曲家
        <a href="https://zh.wikipedia.org/wiki/%E5%BC%97%E9%9B%B7%E5%BE%B7%E9%87%8C%E5%85%8B%C2%B7%E8%82%96%E9%82%A6" target="_blank" rel="noopener">弗雷德里克·肖邦</a>。
        现在我也经常去国家大剧院听音乐会和歌剧。</p>
      <p>我从小喜欢历史，从小学开始看历史书和人物传记，尤其喜欢中世纪西欧历史和地中海地区的历史，这个爱好也一直坚持
        到了现在，我经常会去学校图书馆一层的阅览室看历史书。</p>
      <p>同时，我也喜欢跑步、羽毛球和游泳这三项运动(羽毛球玩的不是很好bushi)。</p>
      <p>小时候我特别喜欢玩乐高，但是现在改成在服务器上玩了
        <a href="https://www.usenix.org/conference/osdi18/presentation/shan" target="_blank" rel="noopener">LegoOS</a>(悲)。</p>
      <p>我也很喜欢看电影，从看的第一部电影《星球大战：新希望》到
        2026年北影节的年轻气盛，我看过了很多电。在初高中的时候，我年年都会关注当年的奥斯卡。</p>
      <p>除此之外，我特别喜爱科幻和魔幻题材的影视剧和书籍，如《冰与火之歌》《指环王》、《西部世界》、《银河帝国》等等。</p>
      <p>我以前也很喜欢玩策略游戏，小学初中的时候爱玩世界征服者和欧陆战争系列。高中之后玩钢铁雄心4、文明六6比较多。我偶尔也玩RPG，
        比如说恐怖类的，像生化危机2、艾尔登法环(我是真的感觉很吓人)、地铁系列，还有最终幻想15、底特律变人、刺客信条系列。</p>
      <p>虽然我一般不怎么看动漫，但是最喜欢的几部番我会时不时拿出来二刷：《咒术回战》、
        《进击的巨人》、《电锯人》、《新世纪福音战士》(看不懂)、《机动战士高达》、《一拳超人》</p>
    </div>

    <div class="social-block fade-in">
      <div class="social-text">
        如果你同样对我的研究方向感兴趣，或者有共同的兴趣爱好，都欢迎通过以下方式和我联系！
      </div>
      <div class="social-icons">
        <a href="https://x.com/niechangnie3" target="_blank" rel="noopener" style="color:#e01b1b"><i class="fa fa-home"></i></a>
        <a href="https://github.com/N-Leon-Wesker-C" target="_blank" rel="noopener" style="color:#feffff"><i class="fa fa-github"></i></a>
        <a href="https://www.linkedin.com/in/chang-nie-2822652b6/" target="_blank" rel="noopener" style="color:#2a12e1"><i class="fa fa-linkedin"></i></a>
        <a href="mailto:2367421497@qq.com" style="color:#ffffff"><i class="fa fa-envelope"></i></a>
        <a href="https://www.instagram.com/changnie80/" target="_blank" rel="noopener" style="color:#e738e4"><i class="fa fa-instagram"></i></a>
        <a href="https://steamcommunity.com/profiles/76561199536217500/" target="_blank" rel="noopener" style="color:#181bef"><i class="fa fa-steam"></i></a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFadeIn } from '../composables/useFadeIn.js'
useFadeIn()
</script>
