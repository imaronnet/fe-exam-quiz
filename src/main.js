import './style.css'
import { questions } from './questions.js'

const state = {
  currentIndex: 0,
  selectedIndex: null,
  score: 0,
  answers: [],
}

const app = document.querySelector('#app')

if (!app) {
  throw new Error('Application root "#app" was not found.')
}

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const getResultMessage = (score, total) => {
  if (total === 0) {
    return 'アプリ内のサンプル問題を確認してください。'
  }

  const rate = score / total

  if (rate === 1) {
    return '満点です。基礎理解はばっちりです。'
  }

  if (rate >= 0.6) {
    return '好調です。この調子で反復しましょう。'
  }

  return '解説を確認しながら、もう一度挑戦してみましょう。'
}

const answerQuestion = (choiceIndex) => {
  if (state.selectedIndex !== null) {
    return
  }

  const question = questions[state.currentIndex]

  if (!question) {
    return
  }

  const isCorrect = choiceIndex === question.correctIndex

  state.selectedIndex = choiceIndex
  state.answers.push({
    questionIndex: state.currentIndex,
    selectedIndex: choiceIndex,
    isCorrect,
  })

  if (isCorrect) {
    state.score += 1
  }

  render()
}

const moveToNextQuestion = () => {
  state.currentIndex += 1
  state.selectedIndex = null
  render()
}

const resetQuiz = () => {
  state.currentIndex = 0
  state.selectedIndex = null
  state.score = 0
  state.answers = []
  render()
}

const renderChoices = (question) =>
  question.choices
    .map((choice, index) => {
      const isAnswered = state.selectedIndex !== null
      const isSelected = state.selectedIndex === index
      const isCorrect = question.correctIndex === index

      let className = 'choice-button'

      if (isAnswered && isCorrect) {
        className += ' choice-button--correct'
      } else if (isAnswered && isSelected && !isCorrect) {
        className += ' choice-button--wrong'
      }

      return `
        <button
          class="${className}"
          type="button"
          data-choice-index="${index}"
          ${isAnswered ? 'disabled' : ''}
        >
          <span class="choice-label">${index + 1}</span>
          <span>${escapeHtml(choice)}</span>
        </button>
      `
    })
    .join('')

const renderQuestionScreen = () => {
  const question = questions[state.currentIndex]

  if (!question) {
    renderResultScreen()
    return
  }

  const answered = state.selectedIndex !== null
  const isCorrect = answered && state.selectedIndex === question.correctIndex

  app.innerHTML = `
    <main class="screen">
      <section class="card">
        <header class="card-header">
          <p class="eyebrow">基本情報技術者試験 4択クイズ</p>
          <div class="status-row">
            <span>第 ${state.currentIndex + 1} 問 / ${questions.length} 問</span>
            <span>正解数 ${state.score}</span>
          </div>
        </header>

        <h1 class="question">${escapeHtml(question.text)}</h1>

        <div class="choices">
          ${renderChoices(question)}
        </div>

        ${
          answered
            ? `
              <section class="feedback ${isCorrect ? 'feedback--correct' : 'feedback--wrong'}">
                <h2>${isCorrect ? '正解です' : '不正解です'}</h2>
                <p>${escapeHtml(question.explanation)}</p>
              </section>
              <div class="actions">
                <button class="secondary-button" type="button" data-action="reset">最初からやり直す</button>
                <button class="primary-button" type="button" data-action="next">
                  ${state.currentIndex === questions.length - 1 ? '結果を見る' : '次の問題へ'}
                </button>
              </div>
            `
            : `
              <p class="helper-text">4つの選択肢から1つ選んでください。</p>
              <div class="actions">
                <button class="secondary-button" type="button" data-action="reset">最初からやり直す</button>
              </div>
            `
        }
      </section>
    </main>
  `
}

const renderResultScreen = () => {
  const total = questions.length
  const percentage = total === 0 ? 0 : Math.round((state.score / total) * 100)
  const resultMessage = escapeHtml(getResultMessage(state.score, total))

  app.innerHTML = `
    <main class="screen">
      <section class="card result-card">
        <p class="eyebrow">結果</p>
        <h1 class="result-score">${state.score} / ${total} 問 正解</h1>
        <p class="result-rate">正答率 ${percentage}%</p>
        <p class="result-message">${resultMessage}</p>
        <button class="primary-button" type="button" data-action="reset">もう一度挑戦する</button>
      </section>
    </main>
  `
}

const renderEmptyState = () => {
  app.innerHTML = `
    <main class="screen">
      <section class="card result-card">
        <p class="eyebrow">お知らせ</p>
        <h1 class="result-score">問題データがありません</h1>
        <p class="result-message">アプリ内のサンプル問題を確認してください。</p>
      </section>
    </main>
  `
}

function render() {
  if (questions.length === 0) {
    renderEmptyState()
  } else if (state.currentIndex >= questions.length) {
    renderResultScreen()
  } else {
    renderQuestionScreen()
  }
}

app.addEventListener('click', (event) => {
  const target = event.target.closest('button')

  if (!target) {
    return
  }

  const { choiceIndex, action } = target.dataset

  if (choiceIndex !== undefined) {
    answerQuestion(Number(choiceIndex))
    return
  }

  if (action === 'next') {
    moveToNextQuestion()
    return
  }

  if (action === 'reset') {
    resetQuiz()
  }
})

render()
