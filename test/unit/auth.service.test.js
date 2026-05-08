const bcrypt = require('bcrypt');

// Mock do bcrypt
jest.mock('bcrypt');

describe('Auth Service', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Password Hashing', () => {
    
    it('deve fazer hash de senha corretamente', async () => {
      const senha = 'senha123';
      const hashedPassword = '$2b$10$abcdefghijklmnopqrstuvwxyz';
      
      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      
      const result = await bcrypt.hash(senha, 10);
      
      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(senha, 10);
    });

    it('deve comparar senhas corretamente', async () => {
      const senha = 'senha123';
      const hash = '$2b$10$abcdefghijklmnopqrstuvwxyz';
      
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      
      const result = await bcrypt.compare(senha, hash);
      
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(senha, hash);
    });

    it('deve retornar false para senha incorreta', async () => {
      const senhaErrada = 'senhaerrada';
      const hash = '$2b$10$abcdefghijklmnopqrstuvwxyz';
      
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      
      const result = await bcrypt.compare(senhaErrada, hash);
      
      expect(result).toBe(false);
    });
  });
});
