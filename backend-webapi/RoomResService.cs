using Microsoft.EntityFrameworkCore;
using ReservationApp.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReservationApp.Services
{
    public class RoomResService : IRoomResService
    {
        private readonly AppDbContext _context;

        public RoomResService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RoomRes>> GetAllRoomReservationsAsync()
        {
            return await _context.RoomReservations.ToListAsync();
        }

        public async Task<RoomRes> GetRoomReservationByIdAsync(int id)
        {
            return await _context.RoomReservations.FindAsync(id);
        }

        public async Task<RoomRes> CreateRoomReservationAsync(RoomRes roomRes)
        {
            _context.RoomReservations.Add(roomRes);
            await _context.SaveChangesAsync();
            return roomRes;
        }

        public async Task UpdateRoomReservationAsync(RoomRes roomRes)
        {
            _context.Entry(roomRes).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRoomReservationAsync(int id)
        {
            var roomRes = await _context.RoomReservations.FindAsync(id);
            if (roomRes != null)
            {
                _context.RoomReservations.Remove(roomRes);
                await _context.SaveChangesAsync();
            }
        }
    }
}

