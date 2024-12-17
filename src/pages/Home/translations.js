const translations = {
    en: {
      greeting1: "Hey, it's Ruru, your virtual assistant!",
      greeting2: 'How can I help you today?',
      greeting3: 'Click options below',
      howToBook: `To book your trip, check the schedule for available departures and select your preferred time.<br>
        You can then proceed with booking by following the prompts.<br>
        <a href="https://swiftsail-ferries.vercel.app/schedule" target="_blank" rel="noopener noreferrer">
          View Schedule
        </a>`,
      shippingLines: `We currently offer the following shipping lines for travel:<br>
        - Swift Sail Ferries<br>
        - BlueWave Travels<br>
        - Horizon Marine Lines<br>
        Click below to view all available shipping companies:<br>
        <a href="https://swiftsail-ferries.vercel.app/companies" target="_blank" rel="noopener noreferrer">
          View Companies
        </a>`,
      paymentMethod: `We accept:<br>
        - Credit/Debit Cards<br>
        - PayPal<br>
        - Bank Transfers<br>
        Payments are securely processed on our platform.`,
      more: `Would you like to talk to a virtual agent for further assistance?<br>
        Click "Yes" to connect or "No" to continue chatting with me.`,
      yes: `Please wait, we are redirecting you to our agent.`,
      no: `Alright, feel free to ask me anything else or choose an option below.`,
      unknown: "I'm not sure about that, but I can assist you with booking or schedules!",
      options: ['How to book?', 'What are the available shipping lines?', 'What is the payment method?', 'More', 'Change Language'],
      languagePrompt: 'Choose a language:',
      languageOptions: ['English', 'Korean', 'Japanese'],
    },
    ko: {
      greeting1: '안녕하세요, 저는 당신의 가상 비서 Ruru입니다!',
      greeting2: '오늘 무엇을 도와드릴까요?',
      greeting3: '아래 옵션을 클릭하세요',
      howToBook: `여행 예약을 하려면, 출발 일정을 확인하고 원하는 시간을 선택하세요.<br>
        그런 다음 안내에 따라 예약을 진행할 수 있습니다.<br>
        <a href="https://swiftsail-ferries.vercel.app/schedule" target="_blank" rel="noopener noreferrer">
          일정 보기
        </a>`,
      shippingLines: `현재 제공하는 선박 라인은 다음과 같습니다:<br>
        - 스위프트 세일 페리<br>
        - 블루웨이브 트래블<br>
        - 호라이즌 마린 라인<br>
        아래 링크를 클릭하여 모든 선박 회사를 확인하세요:<br>
        <a href="https://swiftsail-ferries.vercel.app/companies" target="_blank" rel="noopener noreferrer">
          회사 보기
        </a>`,
      paymentMethod: `결제 방법은 다음과 같습니다:<br>
        - 신용/직불 카드<br>
        - 페이팔<br>
        - 은행 송금<br>
        결제는 안전하게 처리됩니다.`,
      more: '추가 지원을 위해 가상 상담원과 이야기하시겠습니까?<br>"예"를 클릭하면 연결되며, "아니오"를 클릭하면 계속 대화할 수 있습니다.',
      yes: '잠시만 기다려주세요. 당사 에이전트로 리디렉션 중입니다.',
      no: '알겠습니다. 다른 질문이 있으시면 옵션을 선택하거나 물어보세요.',
      unknown: '잘 모르겠지만 예약이나 일정을 도와드릴 수 있습니다!',
      options: ['예약 방법은?', '사용 가능한 선박 라인은?', '결제 방법은?', '더 보기', '언어 변경'],
      languagePrompt: '언어를 선택하세요:',
      languageOptions: ['영어', '한국어', '일본어'],
    },
    ja: {
      greeting1: 'こんにちは、私はあなたの仮想アシスタント、Ruruです！',
      greeting2: '今日はどのようなご用件でしょうか？',
      greeting3: '下のオプションをクリックしてください',
      howToBook: `旅行を予約するには、出発スケジュールを確認し、希望の時間を選択してください。<br>
        その後、指示に従って予約を進めることができます。<br>
        <a href="https://swiftsail-ferries.vercel.app/schedule" target="_blank" rel="noopener noreferrer">
          スケジュールを見る
        </a>`,
      shippingLines: `現在提供している船舶会社は以下の通りです:<br>
        - スイフト・セイル・フェリー<br>
        - ブルーウェーブ・トラベル<br>
        - ホライズン・マリン・ライン<br>
        すべての船舶会社を見るには、下のリンクをクリックしてください:<br>
        <a href="https://swiftsail-ferries.vercel.app/companies" target="_blank" rel="noopener noreferrer">
          会社を見る
        </a>`,
      paymentMethod: `次の支払い方法が利用可能です:<br>
        - クレジット/デビットカード<br>
        - ペイパル<br>
        - 銀行振込<br>
        支払いは安全に処理されます。`,
      more: '追加サポートのため、仮想エージェントと話しますか？<br>"はい"をクリックすると接続され、"いいえ"をクリックするとチャットを続けられます。',
      yes: 'お待ちください。エージェントにリダイレクトします。',
      no: 'わかりました。他の質問があれば、オプションを選ぶか聞いてください。',
      unknown: 'それについてはわかりませんが、予約やスケジュールのサポートはできます！',
      options: ['予約方法は？', '利用可能な船舶会社は？', '支払い方法は？', 'さらに表示', '言語を変更'],
      languagePrompt: '言語を選択してください:',
      languageOptions: ['英語', '韓国語', '日本語'],
    },
  };
  
  export default translations;
  