using Microsoft.EntityFrameworkCore;
using ReservationApp.Models;
using System.Collections.Generic;
using System.Threading.Tasks; //Should be good

namespace ReservationApp.Services
{
    public class DeviceResService : IDeviceResService
    {
        private readonly AppDbContext _context;

        public DeviceResService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DeviceRes>> GetAllDeviceReservationsAsync()
        {
            return await _context.Device_Res.ToListAsync();
        }

        public async Task<DeviceRes> GetDeviceReservationByIdAsync(int id)
        {
            return await _context.Device_Res.FindAsync(id);
        }

        public async Task<DeviceRes> CreateDeviceReservationAsync(DeviceRes deviceRes)
        {
            _context.Device_Res.Add(deviceRes);
            await _context.SaveChangesAsync();
            return deviceRes;
        }

        public async Task UpdateDeviceReservationAsync(DeviceRes deviceRes)
        {
            _context.Entry(deviceRes).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteDeviceReservationAsync(int id)
        {
            var deviceRes = await _context.Device_Res.FindAsync(id);
            if (deviceRes != null)
            {
                _context.Device_Res.Remove(deviceRes);
                await _context.SaveChangesAsync();
            }
        }
    }
}

