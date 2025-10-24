
      (function () {
        function getCorrectSet(fs) {
          return new Set(fs.dataset.answer.split(",").map((s) => s.trim()));
        }
        function getUserSet(fs) {
          const type = fs.dataset.type;
          if (type === "single") {
            const checked = fs.querySelector('input[type="radio"]:checked');
            return new Set(checked ? [checked.value] : []);
          } else {
            const checked = [
              ...fs.querySelectorAll('input[type="checkbox"]:checked'),
            ].map((i) => i.value);
            return new Set(checked);
          }
        }
        function setsEqual(a, b) {
          if (a.size !== b.size) return false;
          for (const v of a) {
            if (!b.has(v)) return false;
          }
          return true;
        }
        function clearVisual(fs) {
          fs.querySelectorAll("label").forEach((l) => {
            l.classList.remove("correct", "incorrect");
          });
          fs.querySelector(".answer").style.display = "none";
        }

        const form = document.getElementById("quiz");
        const all = [...form.querySelectorAll("fieldset")];
        const scoreEl = document.getElementById("score");

        document.getElementById("check").addEventListener("click", () => {
          let correctCount = 0;
          all.forEach((fs) => {
            // clear old
            clearVisual(fs);
            const correctSet = getCorrectSet(fs);
            const userSet = getUserSet(fs);
            const labels = fs.querySelectorAll("label");

            // color choices
            labels.forEach((l) => {
              const input = l.querySelector("input");
              const val = input.value;
              const isCorrectOpt = correctSet.has(val);
              if (input.checked) {
                l.classList.add(isCorrectOpt ? "correct" : "incorrect");
              }
              // also gently mark the correct ones for learning aid
              if (isCorrectOpt) l.style.outline = "1px dashed #7fbf7f";
            });

            const isRight = setsEqual(correctSet, userSet);
            if (isRight) correctCount++;

            // show the official answer text
            fs.querySelector(".answer").style.display = "block";
          });

          scoreEl.textContent = `Score: ${correctCount} / ${all.length}`;
        });

        document.getElementById("reset").addEventListener("click", () => {
          // reset inputs
          form.reset();
          // clear styles
          all.forEach((fs) => {
            fs.querySelectorAll("label").forEach((l) => {
              l.classList.remove("correct", "incorrect");
              l.style.outline = "none";
            });
            fs.querySelector(".answer").style.display = "none";
          });
          scoreEl.textContent = "";
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      })();
