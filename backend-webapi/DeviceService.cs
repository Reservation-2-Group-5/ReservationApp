using Microsoft.EntityFrameworkCore;
using Reservation.Models;
using ReservationApp.Models;
using System.Collections.Generic;
using System.Threading.Tasks; //Should be good

namespace ReservationApp.Services
{
    public class DeviceService : IDeviceService
    {
        private readonly AppDbContext _context;

        public DeviceService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Device>> GetAllDevicesAsync()
        {
            return await _context.Devices.ToListAsync();
        }

        public async Task<Device> GetDeviceByTagAsync(int tag)
        {
            return await _context.Devices.FirstOrDefaultAsync(d => d.Tag == tag);
        }

        public async Task<Device> CreateDeviceAsync(Device device)
        {
            _context.Devices.Add(device);
            await _context.SaveChangesAsync();
            return device;
        }

        public async Task UpdateDeviceAsync(Device device)
        {
            _context.Entry(device).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeviceExists(device.Tag))
                {
                    return; 
                }
                else
                {
                    throw;
                }
            }
        }

        public async Task DeleteDeviceAsync(int tag)
        {
            var device = await _context.Devices.FindAsync(tag);
            if (device != null)
            {
                _context.Devices.Remove(device);
                await _context.SaveChangesAsync();
            }
        }

        private bool DeviceExists(int tag)
        {
            return _context.Devices.Any(e => e.Tag == tag);
        }
    }
}
