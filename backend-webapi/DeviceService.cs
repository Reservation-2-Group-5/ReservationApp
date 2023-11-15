using Microsoft.EntityFrameworkCore;
using Reservation.Models;
using ReservationApp.Models;
using System.Linq;
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
            return await _context.Device.ToListAsync();
        }

        public async Task<Device> GetDeviceByTagAsync(int tag)
        {
            return await _context.Device.FirstOrDefaultAsync(d => d.Tag == tag);
        }

        public async Task<Device> CreateDeviceAsync(Device device)
        {
            _context.Device.Add(device);
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
            var device = await _context.Device.FindAsync(tag);
            if (device != null)
            {
                _context.Device.Remove(device);
                await _context.SaveChangesAsync();
            }
        }

        private bool DeviceExists(int tag)
        {
            return _context.Device.Any(e => e.Tag == tag);
        }
    }
}
