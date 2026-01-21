import axios, { AxiosInstance } from 'axios';

/**
 * Client for interacting with EPSON QB1000 projector web API
 */
export class EpsonProjectorClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(projectorIp: string, port: number = 80) {
    this.baseUrl = `http://${projectorIp}:${port}`;
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  /**
   * Set the lens memory on the projector
   * @param memorySlot The lens memory slot number (1-10)
   */
  async setLensMemory(memorySlot: number): Promise<void> {
    if (memorySlot < 1 || memorySlot > 10) {
      throw new Error('Lens memory slot must be between 1 and 10');
    }
 
    try {
      // EPSON projector API endpoint for lens memory control
      // Note: Actual API endpoint may vary based on projector model
      const response = await this.client.post('/cgi-bin/directsend', 
        `key=LENSMEMORY${memorySlot}`
      );

      if (response.status !== 200) {
        throw new Error(`Failed to set lens memory: ${response.statusText}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Projector communication error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get projector status (for testing/verification)
   */
  async getStatus(): Promise<any> {
    try {
      const response = await this.client.get('/cgi-bin/status');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get projector status: ${error.message}`);
      }
      throw error;
    }
  }
}
