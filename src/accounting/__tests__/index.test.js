const { getBalance, credit, debit, resetBalance, validateChoice } = require('../index');

describe('Student Account Management System Tests', () => {
  beforeEach(() => {
    resetBalance();
  });

  describe('UC-001: システム初期化テスト', () => {
    test('初期残高が1000.00であること', () => {
      expect(getBalance()).toBe(1000.00);
    });
  });

  describe('UC-002: 残高表示 - 正常系', () => {
    test('残高表示が正確であること', () => {
      expect(getBalance()).toBe(1000.00);
    });
  });

  describe('UC-003: 入金処理 - 正常系（小額入金）', () => {
    test('100円入金で残高が1100.00になること', () => {
      const newBalance = credit(100);
      expect(newBalance).toBe(1100.00);
      expect(getBalance()).toBe(1100.00);
    });
  });

  describe('UC-004: 入金処理 - 正常系（大額入金）', () => {
    test('900000円入金で残高が901000.00になること', () => {
      const newBalance = credit(900000);
      expect(newBalance).toBe(901000.00);
      expect(getBalance()).toBe(901000.00);
    });
  });

  describe('UC-005: 出金処理 - 正常系（小額出金）', () => {
    test('300円出金で残高が700.00になること', () => {
      const newBalance = debit(300);
      expect(newBalance).toBe(700.00);
      expect(getBalance()).toBe(700.00);
    });
  });

  describe('UC-006: 出金処理 - 正常系（全額出金）', () => {
    test('1000円出金で残高が0.00になること', () => {
      const newBalance = debit(1000);
      expect(newBalance).toBe(0.00);
      expect(getBalance()).toBe(0.00);
    });
  });

  describe('UC-007: 出金処理 - 異常系（残高不足）', () => {
    test('残高不足でエラーが発生すること', () => {
      expect(() => debit(2000)).toThrow('Insufficient funds for this debit.');
      expect(getBalance()).toBe(1000.00); // 残高が変わらない
    });
  });

  describe('UC-008: 出金処理 - 異常系（ゼロ円出金）', () => {
    test('0円出金で残高が変わらないこと', () => {
      const newBalance = debit(0);
      expect(newBalance).toBe(1000.00);
      expect(getBalance()).toBe(1000.00);
    });
  });

  describe('UC-009: 出金処理 - 異常系（負の金額）', () => {
    test('負の金額出金でエラーが発生すること', () => {
      expect(() => debit(-500)).toThrow('Invalid debit amount.');
    });
  });

  describe('IT-001: メニュー操作 - 正常なナビゲーション', () => {
    test('連続操作で残高が正確に更新されること', () => {
      credit(500);
      expect(getBalance()).toBe(1500.00);
      debit(300);
      expect(getBalance()).toBe(1200.00);
    });
  });

  describe('IT-002: メニュー操作 - 無効な入力', () => {
    test('無効な選択がfalseを返すこと', () => {
      expect(validateChoice('5')).toBe(false);
      expect(validateChoice('0')).toBe(false);
      expect(validateChoice('A')).toBe(false);
    });
    test('有効な選択がtrueを返すこと', () => {
      expect(validateChoice('1')).toBe(true);
      expect(validateChoice('2')).toBe(true);
      expect(validateChoice('3')).toBe(true);
      expect(validateChoice('4')).toBe(true);
    });
  });

  describe('IT-004: データ永続化 - データの連続性', () => {
    test('複数トランザクションで残高が正確に保持されること', () => {
      credit(100);
      expect(getBalance()).toBe(1100.00);
      debit(50);
      expect(getBalance()).toBe(1050.00);
      credit(200);
      expect(getBalance()).toBe(1250.00);
      debit(200);
      expect(getBalance()).toBe(1050.00);
    });
  });

  describe('IT-005: 境界値テスト - 満額入金と満額出金', () => {
    test('最大残高に近づく', () => {
      credit(998999);
      expect(getBalance()).toBe(999999.00);
    });
    test('最小残高', () => {
      debit(1000);
      expect(getBalance()).toBe(0.00);
    });
  });

  describe('IT-006: 業務ルール検証 - 残高不足時の取引拒否', () => {
    test('残高不足で取引が拒否されること', () => {
      resetBalance();
      // 残高500に設定
      debit(500);
      expect(() => debit(1000)).toThrow('Insufficient funds for this debit.');
      expect(getBalance()).toBe(500.00);
    });
  });

  describe('IT-008: パフォーマンステスト - 大量トランザクション', () => {
    test('大量トランザクションで正確性', () => {
      for (let i = 0; i < 10; i++) {
        credit(100);
      }
      expect(getBalance()).toBe(2000.00);
      for (let i = 0; i < 5; i++) {
        debit(200);
      }
      expect(getBalance()).toBe(1000.00);
    });
  });
});