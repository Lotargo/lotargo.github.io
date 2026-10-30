#!/usr/bin/env python3
"""Draw the bilingual Sonata article diagrams as editable, dependency-free SVG."""

from __future__ import annotations

from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "blog/assets/sonata-learning-report"
SVG = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG)

COPY = {
    "ru": {
        "title": "Sonata: собственное ядро и модельные профили",
        "mobile_title": "Sonata: ядро и профили",
        "desc": "Общее ядро Sonata исполняет два отдельных контура. Гибридный прототип объединяет рекуррентную ветвь, causal attention и SwiGLU/MLP взвешенной суммой. Для языковых, диалоговых и фактических результатов использовался другой профиль: BPE 2048, embedding, шесть блоков RMSNorm, рекуррентного вычисления и residual, затем final RMSNorm и линейная выходная голова. В этом профиле нет attention или отдельной MLP-ветви гибрида.",
        "core": "Собственное ядро Sonata",
        "core_items": [("Тензоры", "и память"), ("Граф операций", "и autograd"), ("CPU / CUDA", "операторы"), ("Adam", "и обучение")],
        "hybrid": "Гибридный прототип",
        "hybrid_sub": "Три параллельные ветви",
        "recurrence": "Рекуррентная R(x)",
        "recurrence_sub": "Mamba-подобный блок",
        "attention": "Causal attention A(x)",
        "attention_sub": "CPU в этом прототипе",
        "mlp": "SwiGLU / MLP F(x)",
        "mlp_sub": "Преобразование признаков",
        "coefficients": "Коэффициенты задаются конфигурацией.",
        "hybrid_scope": "Совместное обучение: отдельный опыт.",
        "profile": "Профиль результатов",
        "profile_sub": "Язык · Диалог · Факты",
        "parameters": "4 504 192 параметра · FP32 · Adam · seed 17",
        "tokens": "Токены BPE · 2048",
        "embedding": "Embedding",
        "six": "6 последовательных блоков",
        "block": "RMSNorm → рекуррентный блок",
        "residual": "+ residual",
        "dimensions": "d_model 256 · d_state 32 · expand 2",
        "norm": "Final RMSNorm → Linear LM head",
        "logits": "Logits → генерация",
        "profile_scope": "Без attention и отдельной MLP-ветви прототипа.",
        "profile_scope_mobile": ["Без attention и отдельной", "MLP-ветви гибридного прототипа."],
        "legend": "Пунктир: используется общее ядро. Сплошные стрелки: поток тензоров.",
        "legend_mobile": ["Пунктир: общее ядро.", "Сплошные стрелки: поток тензоров."],
    },
    "en": {
        "title": "Sonata: custom engine and model profiles",
        "mobile_title": "Sonata: engine and profiles",
        "desc": "A shared Sonata engine executes two separate profiles. The hybrid prototype combines recurrence, causal attention and SwiGLU/MLP with a weighted sum. Language, dialogue and fact results use another profile: BPE 2048, an embedding, six RMSNorm, recurrence and residual blocks, then final RMSNorm and a linear output head. This profile has no attention or separate MLP branch from the hybrid prototype.",
        "core": "Custom Sonata engine",
        "core_items": [("Tensors", "and memory"), ("Operation graph", "and autograd"), ("CPU / CUDA", "operators"), ("Adam", "and training")],
        "hybrid": "Hybrid prototype",
        "hybrid_sub": "Three parallel branches",
        "recurrence": "Recurrence R(x)",
        "recurrence_sub": "Mamba-inspired block",
        "attention": "Causal attention A(x)",
        "attention_sub": "CPU in this prototype",
        "mlp": "SwiGLU / MLP F(x)",
        "mlp_sub": "Feature transformation",
        "coefficients": "Coefficients are set by configuration.",
        "hybrid_scope": "Joint training is a separate experiment.",
        "profile": "Measured profile",
        "profile_sub": "Language · Dialogue · Facts",
        "parameters": "4,504,192 parameters · FP32 · Adam · seed 17",
        "tokens": "BPE tokens · 2048",
        "embedding": "Embedding",
        "six": "6 sequential blocks",
        "block": "RMSNorm → recurrent block",
        "residual": "+ residual",
        "dimensions": "d_model 256 · d_state 32 · expand 2",
        "norm": "Final RMSNorm → Linear LM head",
        "logits": "Logits → generation",
        "profile_scope": "No attention or separate MLP branch from the prototype.",
        "profile_scope_mobile": ["No attention or separate MLP branch", "from the hybrid prototype."],
        "legend": "Dashed: uses the shared engine. Solid arrows: tensor flow.",
        "legend_mobile": ["Dashed: shared engine.", "Solid arrows: tensor flow."],
    },
}


def element(parent: ET.Element, tag: str, **attrs) -> ET.Element:
    return ET.SubElement(parent, f"{{{SVG}}}{tag}", {k.replace("_", "-"): str(v) for k, v in attrs.items()})


class Drawing:
    def __init__(self, language: str, mobile: bool):
        self.copy = COPY[language]
        self.width, self.height = (800, 2140) if mobile else (1600, 1130)
        self.root = ET.Element(f"{{{SVG}}}svg", {
            "viewBox": f"0 0 {self.width} {self.height}",
            "width": str(self.width), "height": str(self.height),
            "role": "img", "aria-labelledby": "title description", "lang": language,
        })
        element(self.root, "title", id="title").text = self.copy["title"]
        element(self.root, "desc", id="description").text = self.copy["desc"]
        defs = element(self.root, "defs")
        for name, color in [("arrow", "#53665b"), ("engine-arrow", "#78857c"), ("green-arrow", "#276749")]:
            marker = element(defs, "marker", id=name, viewBox="0 0 10 10", refX=9, refY=5, markerWidth=8, markerHeight=8, orient="auto-start-reverse")
            element(marker, "path", d="M 0 0 L 10 5 L 0 10 Z", fill=color)
        element(self.root, "style").text = """
text { font-family: Inter, 'Segoe UI', Arial, sans-serif; fill: #19271f; }
.muted { fill: #4d6054; } .white { fill: #fff; } .soft-white { fill: #dbe6df; }
.green { fill: #205e40; } .bold { font-weight: 650; }
"""
        element(self.root, "rect", width=self.width, height=self.height, fill="#fbfcf8")

    def text(self, x, y, value, size=28, cls="", anchor="start"):
        node = element(self.root, "text", x=x, y=y, font_size=size, text_anchor=anchor)
        if cls:
            node.set("class", cls)
        node.text = value
        return node

    def rect(self, x, y, width, height, fill="#fff", stroke="#87988c", dash=False, weight=2):
        node = element(self.root, "rect", x=x, y=y, width=width, height=height, rx=10, fill=fill, stroke=stroke, stroke_width=weight)
        if dash:
            node.set("stroke-dasharray", "9 7")
        return node

    def path(self, data, kind="arrow", dashed=False, arrow=True):
        node = element(self.root, "path", d=data, fill="none", stroke={"arrow":"#53665b", "engine-arrow":"#78857c", "green-arrow":"#276749"}[kind], stroke_width=3, stroke_linejoin="round")
        if arrow:
            node.set("marker-end", f"url(#{kind})")
        if dashed:
            node.set("stroke-dasharray", "9 7")
        return node

    def node(self, x, y, width, height, label, size=26, green=False):
        self.rect(x, y, width, height, stroke="#488766" if green else "#87988c")
        self.text(x+width/2, y+height/2+size*.34, label, size, anchor="middle")

    def branch(self, x, y, width, height, label, subtitle, mobile=False):
        self.rect(x, y, width, height)
        self.text(x+18, y+36, label, 33 if mobile else 25, "bold")
        self.text(x+18, y+72, subtitle, 29 if mobile else 22, "muted")

    def desktop(self):
        c = self.copy
        self.text(64, 58, c["title"], 39, "bold")
        self.rect(64, 98, 1472, 168, "#18271f", "#18271f")
        self.text(92, 143, c["core"], 33, "white bold")
        self.text(1508, 143, "Free Pascal / CUDA", 24, "soft-white", "end")
        for index, lines in enumerate(c["core_items"]):
            x = 92 + index*355
            self.text(x, 194, lines[0], 25, "soft-white")
            self.text(x, 232, lines[1], 25, "soft-white")
        self.path("M 800 266 V 310 H 416 V 350", "engine-arrow", dashed=True)
        self.path("M 800 310 H 1184 V 350", "engine-arrow", dashed=True)

        self.rect(64, 350, 704, 692, "#f7f8f4", "#7a897e", dash=True)
        self.text(92, 396, c["hybrid"], 31, "bold")
        self.text(92, 431, c["hybrid_sub"], 24, "muted")
        self.node(92, 596, 84, 80, "x", 38)
        self.path("M 176 636 H 208", arrow=False)
        self.path("M 208 516 V 756", arrow=False)
        for y, key in [(470,"recurrence"),(590,"attention"),(710,"mlp")]:
            self.path(f"M 208 {y+46} H 230")
            self.branch(230, y, 330, 92, c[key], c[f"{key}_sub"])
        self.path("M 560 516 H 640 V 601")
        self.path("M 560 636 H 605")
        self.path("M 560 756 H 640 V 671")
        element(self.root, "circle", cx=640, cy=636, r=35, fill="#fff", stroke="#53665b", stroke_width=3)
        self.text(640, 648, "Σ", 35, "bold", "middle")
        self.path("M 675 636 H 732")
        self.text(732, 681, "H(x)", 26, anchor="end")
        self.text(92, 863, "H(x) = αR(x) + βA(x) + γF(x)", 28, "bold")
        self.text(92, 920, c["coefficients"], 24, "muted")
        self.text(92, 964, c["hybrid_scope"], 24, "muted")

        self.rect(832, 350, 704, 692, "#edf5ef", "#276749", weight=3)
        self.text(860, 396, c["profile"], 31, "green bold")
        self.text(860, 431, c["profile_sub"], 24, "green")
        self.text(860, 469, c["parameters"], 23)
        self.node(1020, 492, 328, 54, c["tokens"], 25, green=True)
        self.path("M 1184 546 V 570", "green-arrow")
        self.node(1020, 570, 328, 54, c["embedding"], 26, green=True)
        self.path("M 1184 624 V 648", "green-arrow")
        self.rect(916, 648, 536, 154, stroke="#488766")
        self.text(1184, 685, c["six"], 25, "bold", "middle")
        self.text(1184, 725, c["block"], 24, anchor="middle")
        self.text(1184, 758, c["residual"], 23, anchor="middle")
        self.text(1184, 788, c["dimensions"], 21, "muted", "middle")
        self.path("M 1184 802 V 826", "green-arrow")
        self.node(948, 826, 472, 54, c["norm"], 24, green=True)
        self.path("M 1184 880 V 904", "green-arrow")
        self.node(1020, 904, 328, 54, c["logits"], 25, green=True)
        self.text(860, 1007, c["profile_scope"], 22, "green")
        self.text(64, 1094, c["legend"], 23, "muted")

    def mobile(self):
        c = self.copy
        self.text(32, 51, c["mobile_title"], 35, "bold")
        self.rect(32, 88, 736, 300, "#18271f", "#18271f")
        self.text(56, 140, c["core"], 36, "white bold")
        for index, lines in enumerate(c["core_items"]):
            x, y = 56+(index%2)*352, 202+(index//2)*100
            self.text(x, y, lines[0], 32, "soft-white")
            self.text(x, y+44, lines[1], 32, "soft-white")
        # Both profiles attach to the same engine bus, never to one another.
        self.path("M 400 388 V 420 H 18 V 1210", "engine-arrow", dashed=True, arrow=False)
        self.path("M 18 486 H 32", "engine-arrow", dashed=True)
        self.path("M 18 1210 H 32", "engine-arrow", dashed=True)
        self.rect(32, 448, 736, 668, "#f7f8f4", "#7a897e", dash=True)
        self.text(56, 501, c["hybrid"], 36, "bold")
        self.text(56, 543, c["hybrid_sub"], 31, "muted")
        self.node(56, 724, 104, 64, "x", 39)
        self.path("M 160 756 H 190", arrow=False)
        self.path("M 190 625 V 889", arrow=False)
        for y, key in [(578,"recurrence"),(710,"attention"),(842,"mlp")]:
            self.path(f"M 190 {y+47} H 220")
            self.branch(220, y, 400, 94, c[key], c[f"{key}_sub"], mobile=True)
        self.path("M 620 625 H 694 V 719")
        self.path("M 620 757 H 656")
        self.path("M 620 889 H 694 V 795")
        element(self.root, "circle", cx=694, cy=757, r=38, fill="#fff", stroke="#53665b", stroke_width=3)
        self.text(694, 770, "Σ", 39, "bold", "middle")
        self.path("M 732 757 H 744 V 944")
        self.text(744, 986, "H(x)", 29, anchor="end")
        self.text(56, 992, "H(x) = αR(x) + βA(x) + γF(x)", 33, "bold")
        self.text(56, 1043, c["coefficients"], 28, "muted")
        self.text(56, 1085, c["hybrid_scope"], 28, "muted")

        self.rect(32, 1172, 736, 832, "#edf5ef", "#276749", weight=3)
        self.text(56, 1228, c["profile"], 36, "green bold")
        self.text(56, 1269, c["profile_sub"], 31, "green")
        self.text(56, 1310, c["parameters"], 28)
        self.node(180, 1344, 440, 60, c["tokens"], 33, green=True)
        self.path("M 400 1404 V 1430", "green-arrow")
        self.node(180, 1430, 440, 60, c["embedding"], 34, green=True)
        self.path("M 400 1490 V 1516", "green-arrow")
        self.rect(80, 1516, 640, 180, stroke="#488766")
        self.text(400, 1558, c["six"], 32, "bold", "middle")
        self.text(400, 1599, c["block"], 31, anchor="middle")
        self.text(400, 1640, c["residual"], 31, anchor="middle")
        self.text(400, 1680, c["dimensions"], 28, "muted", "middle")
        self.path("M 400 1696 V 1722", "green-arrow")
        self.rect(160, 1722, 480, 88, stroke="#488766")
        self.text(400, 1754, "Final RMSNorm", 30, anchor="middle")
        self.text(400, 1798, "Linear LM head", 30, anchor="middle")
        self.path("M 400 1810 V 1836", "green-arrow")
        self.node(180, 1836, 440, 60, c["logits"], 33, green=True)
        for index, line in enumerate(c["profile_scope_mobile"]):
            self.text(56, 1940+index*40, line, 31, "green")
        for index, line in enumerate(c["legend_mobile"]):
            self.text(32, 2071+index*40, line, 30, "muted")

    def save(self, language: str, mobile: bool):
        suffix = "-mobile" if mobile else ""
        path = OUTPUT / f"sonata-architecture-{language}{suffix}.svg"
        ET.indent(self.root, space="  ")
        ET.ElementTree(self.root).write(path, encoding="utf-8", xml_declaration=True)
        print(path.relative_to(ROOT))


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for language in ("ru", "en"):
        for mobile in (False, True):
            drawing = Drawing(language, mobile)
            drawing.mobile() if mobile else drawing.desktop()
            drawing.save(language, mobile)


if __name__ == "__main__":
    main()
